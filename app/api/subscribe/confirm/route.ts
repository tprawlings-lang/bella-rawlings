import { NextRequest, NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/base-url";
import { verifySubscribeToken } from "@/lib/subscribe-token";

/**
 * Double opt-in step 2: the fan clicked the confirmation link, so NOW
 * the email is added to the Resend audience.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const email = verifySubscribeToken(token);
  const base = getBaseUrl();
  if (!email) {
    return NextResponse.redirect(`${base}/subscribed?status=expired`);
  }

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) {
    return NextResponse.redirect(`${base}/subscribed?status=error`);
  }

  const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ email, unsubscribed: false }),
  });

  if (!res.ok) {
    console.error("Resend add contact failed:", res.status, await res.text());
    return NextResponse.redirect(`${base}/subscribed?status=error`);
  }
  return NextResponse.redirect(`${base}/subscribed?status=ok`);
}
