import { getToken, saveToken, type TokenRecord } from "@/lib/tokens";
import type { SocialPost, SocialProvider } from "./types";

const API = "https://open.tiktokapis.com/v2";

/**
 * Tier 2: TikTok Display API (scopes: user.info.basic, video.list).
 * TikTok access tokens last 24h; the refresh token (1 year, rotated on use)
 * is used to mint a fresh one on demand.
 */
export class TikTokProvider implements SocialProvider {
  platform = "tiktok" as const;

  async isConnected(): Promise<boolean> {
    return Boolean(await getToken("tiktok"));
  }

  async getFeed(limit: number): Promise<SocialPost[]> {
    const accessToken = await ensureFreshTikTokToken();
    if (!accessToken) return [];

    const fields = "id,title,cover_image_url,share_url,view_count,create_time";
    const res = await fetch(`${API}/video/list/?fields=${fields}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ max_count: Math.min(limit, 20) }),
      next: { revalidate: 3600 }, // ISR cache: at most one API hit per hour
    });
    if (!res.ok) {
      console.error("TikTok feed error:", res.status, await res.text());
      return [];
    }
    const data = (await res.json()) as {
      data?: {
        videos?: {
          id: string;
          title?: string;
          cover_image_url?: string;
          share_url: string;
          view_count?: number;
          create_time?: number;
        }[];
      };
    };

    return (data.data?.videos ?? []).map((v) => ({
      id: v.id,
      platform: "tiktok" as const,
      url: v.share_url,
      caption: v.title,
      thumbnailUrl: v.cover_image_url,
      timestamp: v.create_time ? new Date(v.create_time * 1000).toISOString() : undefined,
      viewCount: v.view_count,
    }));
  }
}

/**
 * Returns a valid TikTok access token, refreshing (and rotating the refresh
 * token) if the current one is expired or about to expire.
 */
export async function ensureFreshTikTokToken(): Promise<string | null> {
  const token = await getToken("tiktok");
  if (!token) return null;

  const expiresSoon = token.expiresAt !== undefined && token.expiresAt < Date.now() + 5 * 60_000;
  if (!expiresSoon) return token.accessToken;
  if (!token.refreshToken) return token.accessToken; // env-seeded token; can't refresh

  const refreshed = await refreshTikTokToken(token);
  return refreshed?.accessToken ?? null;
}

export async function refreshTikTokToken(
  current?: TokenRecord | null
): Promise<TokenRecord | null> {
  const token = current ?? (await getToken("tiktok"));
  if (!token?.refreshToken) return null;

  const res = await fetch(`${API}/oauth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY ?? "",
      client_secret: process.env.TIKTOK_CLIENT_SECRET ?? "",
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    console.error("TikTok token refresh failed:", res.status, await res.text());
    return null;
  }
  const data = (await res.json()) as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_expires_in: number;
  };
  const record: TokenRecord = {
    ...token,
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + data.expires_in * 1000,
    refreshExpiresAt: Date.now() + data.refresh_expires_in * 1000,
    obtainedAt: Date.now(),
  };
  await saveToken("tiktok", record);
  return record;
}
