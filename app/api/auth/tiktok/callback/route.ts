import { NextRequest, NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/base-url";
import { saveToken } from "@/lib/tokens";

/**
 * OAuth callback for TikTok. Exchanges the code for access + refresh tokens
 * (access lasts 24h and is auto-refreshed on demand; refresh token lasts a
 * year), stores them server-side, and returns the artist to /admin.
 */
export async function GET(request: NextRequest) {
  const adminUrl = `${getBaseUrl()}/admin`;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const cookieState = request.cookies.get("tt_oauth_state")?.value;

  if (!code || !state || !cookieState || state !== cookieState) {
    return NextResponse.redirect(`${adminUrl}?error=tiktok_auth_failed`);
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  if (!clientKey || !clientSecret) {
    return NextResponse.redirect(`${adminUrl}?error=tiktok_not_configured`);
  }

  try {
    const tokenRes = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: `${getBaseUrl()}/api/auth/tiktok/callback`,
        code,
      }),
      cache: "no-store",
    });
    if (!tokenRes.ok) throw new Error(`token exchange: ${tokenRes.status} ${await tokenRes.text()}`);
    const data = (await tokenRes.json()) as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      refresh_expires_in: number;
    };

    // Grab the display name so /admin can show who's connected
    let username: string | undefined;
    const meRes = await fetch(
      "https://open.tiktokapis.com/v2/user/info/?fields=display_name",
      { headers: { Authorization: `Bearer ${data.access_token}` }, cache: "no-store" }
    );
    if (meRes.ok) {
      const me = (await meRes.json()) as { data?: { user?: { display_name?: string } } };
      username = me.data?.user?.display_name;
    }

    await saveToken("tiktok", {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + data.expires_in * 1000,
      refreshExpiresAt: Date.now() + data.refresh_expires_in * 1000,
      username,
      obtainedAt: Date.now(),
    });

    const res = NextResponse.redirect(`${adminUrl}?connected=tiktok`);
    res.cookies.delete("tt_oauth_state");
    return res;
  } catch (err) {
    console.error("TikTok OAuth callback failed:", err);
    return NextResponse.redirect(`${adminUrl}?error=tiktok_auth_failed`);
  }
}
