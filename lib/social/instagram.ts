import { getToken, saveToken } from "@/lib/tokens";
import type { SocialPost, SocialProvider } from "./types";

const GRAPH = "https://graph.instagram.com";

/**
 * Tier 2: Instagram API with Instagram Login (Basic Display API was retired
 * Dec 2024). Requires the artist's Instagram to be a Professional (Creator)
 * account and a long-lived token obtained via the /admin connect flow.
 */
export class InstagramProvider implements SocialProvider {
  platform = "instagram" as const;

  async isConnected(): Promise<boolean> {
    return Boolean(await getToken("instagram"));
  }

  async getFeed(limit: number): Promise<SocialPost[]> {
    const token = await getToken("instagram");
    if (!token) return [];

    const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
    const res = await fetch(
      `${GRAPH}/me/media?fields=${fields}&limit=${limit}&access_token=${token.accessToken}`,
      { next: { revalidate: 3600 } } // ISR cache: at most one API hit per hour
    );
    if (!res.ok) {
      console.error("Instagram feed error:", res.status, await res.text());
      return [];
    }
    const data = (await res.json()) as {
      data?: {
        id: string;
        caption?: string;
        media_type: string;
        media_url?: string;
        thumbnail_url?: string;
        permalink: string;
        timestamp: string;
      }[];
    };

    return (data.data ?? []).map((m) => ({
      id: m.id,
      platform: "instagram" as const,
      url: m.permalink,
      caption: m.caption,
      thumbnailUrl: m.media_type === "VIDEO" ? m.thumbnail_url : m.media_url,
      timestamp: m.timestamp,
    }));
  }
}

/**
 * Long-lived Instagram tokens last 60 days and can be refreshed any time
 * after they're 24 hours old. Called by the weekly cron.
 */
export async function refreshInstagramToken(): Promise<{ refreshed: boolean; detail: string }> {
  const token = await getToken("instagram");
  if (!token) return { refreshed: false, detail: "not connected" };
  if (Date.now() - token.obtainedAt < 24 * 3600_000 && token.obtainedAt !== 0) {
    return { refreshed: false, detail: "token is less than 24h old" };
  }

  const res = await fetch(
    `${GRAPH}/refresh_access_token?grant_type=ig_refresh_token&access_token=${token.accessToken}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    return { refreshed: false, detail: `refresh failed: ${res.status} ${await res.text()}` };
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  await saveToken("instagram", {
    ...token,
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
    obtainedAt: Date.now(),
  });
  return { refreshed: true, detail: `new expiry in ${Math.round(data.expires_in / 86400)} days` };
}
