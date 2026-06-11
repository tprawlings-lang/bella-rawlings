import { NextRequest, NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/base-url";
import { saveToken } from "@/lib/tokens";

/**
 * OAuth callback for Instagram. Exchanges the code for a short-lived token,
 * upgrades it to a long-lived token (60 days, refreshed by cron), stores it
 * server-side, and sends the artist back to /admin.
 */
export async function GET(request: NextRequest) {
  const adminUrl = `${getBaseUrl()}/admin`;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const cookieState = request.cookies.get("ig_oauth_state")?.value;

  if (!code || !state || !cookieState || state !== cookieState) {
    return NextResponse.redirect(`${adminUrl}?error=instagram_auth_failed`);
  }

  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${adminUrl}?error=instagram_not_configured`);
  }

  try {
    // 1. code -> short-lived token
    const tokenRes = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: `${getBaseUrl()}/api/auth/instagram/callback`,
        code,
      }),
      cache: "no-store",
    });
    if (!tokenRes.ok) throw new Error(`token exchange: ${tokenRes.status} ${await tokenRes.text()}`);
    const shortLived = (await tokenRes.json()) as { access_token: string };

    // 2. short-lived -> long-lived (60 days)
    const longRes = await fetch(
      `https://graph.instagram.com/access_token?grant_type=ig_exchange_token` +
        `&client_secret=${clientSecret}&access_token=${shortLived.access_token}`,
      { cache: "no-store" }
    );
    if (!longRes.ok) throw new Error(`long-lived exchange: ${longRes.status} ${await longRes.text()}`);
    const longLived = (await longRes.json()) as { access_token: string; expires_in: number };

    // 3. grab the username so /admin can show who's connected
    let username: string | undefined;
    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=username&access_token=${longLived.access_token}`,
      { cache: "no-store" }
    );
    if (meRes.ok) username = ((await meRes.json()) as { username?: string }).username;

    await saveToken("instagram", {
      accessToken: longLived.access_token,
      expiresAt: Date.now() + longLived.expires_in * 1000,
      username,
      obtainedAt: Date.now(),
    });

    const res = NextResponse.redirect(`${adminUrl}?connected=instagram`);
    res.cookies.delete("ig_oauth_state");
    return res;
  } catch (err) {
    console.error("Instagram OAuth callback failed:", err);
    return NextResponse.redirect(`${adminUrl}?error=instagram_auth_failed`);
  }
}
