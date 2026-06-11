import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getBaseUrl } from "@/lib/base-url";

/**
 * Starts the "Connect TikTok" flow (TikTok Display API,
 * scopes: user.info.basic + video.list). The artist consents on TikTok's
 * own screen — no passwords shared.
 */
export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.redirect(`${getBaseUrl()}/admin`);
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  if (!clientKey) {
    return NextResponse.redirect(`${getBaseUrl()}/admin?error=tiktok_not_configured`);
  }

  const state = randomBytes(16).toString("hex");
  const authorize = new URL("https://www.tiktok.com/v2/auth/authorize/");
  authorize.searchParams.set("client_key", clientKey);
  authorize.searchParams.set("scope", "user.info.basic,video.list");
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("redirect_uri", `${getBaseUrl()}/api/auth/tiktok/callback`);
  authorize.searchParams.set("state", state);

  const res = NextResponse.redirect(authorize.toString());
  res.cookies.set("tt_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
