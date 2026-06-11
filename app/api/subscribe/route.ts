import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/base-url";
import { createSubscribeToken } from "@/lib/subscribe-token";
import { site } from "@/content/site";

/**
 * Email capture — DOUBLE OPT-IN, email-only, per the minor-artist spec:
 * no age/birthdate fields, nothing stored until the fan clicks the
 * confirmation link we email them. Requires RESEND_API_KEY +
 * RESEND_AUDIENCE_ID (and a verified sending domain in Resend).
 */
export async function POST(request: Request) {
  const { email } = (await request.json().catch(() => ({}))) as { email?: string };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !process.env.RESEND_AUDIENCE_ID) {
    return NextResponse.json(
      { error: "The mailing list isn't set up yet — check back soon!" },
      { status: 503 }
    );
  }

  const link = `${getBaseUrl()}/api/subscribe/confirm?token=${encodeURIComponent(createSubscribeToken(email))}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "website@bellarawlings.com",
      to: [email],
      subject: `Confirm your spot on ${site.artistName}'s list`,
      text:
        `Hi! Tap the link below to confirm you want updates from ${site.artistName} ` +
        `(new songs, shows, and the occasional secret):\n\n${link}\n\n` +
        `If you didn't sign up at ${site.url}, just ignore this email and nothing will be stored.\n\n` +
        `Privacy policy: ${site.url}/privacy`,
    }),
  });

  if (!res.ok) {
    console.error("Resend confirm email failed:", res.status, await res.text());
    return NextResponse.json(
      { error: "Something went wrong — please try again." },
      { status: 502 }
    );
  }
  return NextResponse.json({
    ok: true,
    message: "Almost there — check your inbox and tap the confirmation link.",
  });
}
