import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getBaseUrl } from "@/lib/base-url";

/**
 * Starts the "Connect Instagram" flow (Instagram API with Instagram Login).
 * The artist authenticates on Instagram's own consent screen — her password
 * never touches this site.
 */
export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.redirect(`${getBaseUrl()}/admin`);
  }

  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  if (!clientId) {
    return NextResponse.redirect(`${getBaseUrl()}/admin?error=instagram_not_configured`);
  }

  const state = randomBytes(16).toString("hex");
  const authorize = new URL("https://www.instagram.com/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", `${getBaseUrl()}/api/auth/instagram/callback`);
  authorize.searchParams.set("response_type", "code");
  authorize.searchParams.set("scope", "instagram_business_basic");
  authorize.searchParams.set("state", state);

  const res = NextResponse.redirect(authorize.toString());
  res.cookies.set("ig_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });
  return res;
}
