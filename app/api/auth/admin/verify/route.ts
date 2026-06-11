import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, createSessionValue, isValidMagicToken } from "@/lib/admin-auth";
import { getBaseUrl } from "@/lib/base-url";

/** Magic-link landing: validates the token and starts an admin session. */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!isValidMagicToken(token)) {
    return NextResponse.redirect(`${getBaseUrl()}/admin?error=link_expired`);
  }
  const res = NextResponse.redirect(`${getBaseUrl()}/admin`);
  res.cookies.set(ADMIN_COOKIE, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 3600,
  });
  return res;
}
