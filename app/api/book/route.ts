import { NextRequest, NextResponse } from "next/server";
import { site } from "@/content/site";

/**
 * Booking inquiries → guardian/manager email ONLY (site.guardianEmail).
 * Spam protection per spec: honeypot field + light rate limit, no
 * data-harvesting CAPTCHAs.
 */

// Best-effort in-memory rate limit (per serverless instance).
const submissions = new Map<string, number[]>();
const WINDOW_MS = 3600_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (submissions.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  submissions.set(ip, recent);
  return false;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests — please try again later." },
      { status: 429 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, string | undefined>;
  const { name, org, eventType, date, venue, budget, message, website } = body;

  // Honeypot: the hidden "website" field is invisible to humans.
  // Bots fill it in; we pretend success and drop the message.
  if (website) return NextResponse.json({ ok: true });

  const email = body.email ?? "";
  if (
    !name?.trim() ||
    !message?.trim() ||
    !eventType?.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json(
      { error: "Please fill in your name, email, event type, and message." },
      { status: 400 }
    );
  }
  if (message.length > 5000) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: `The booking form isn't set up yet — email ${site.guardianEmail} directly.` },
      { status: 503 }
    );
  }

  const lines = [
    `Name: ${name}`,
    `Email: ${email}`,
    org && `Organization: ${org}`,
    `Event type: ${eventType}`,
    date && `Event date: ${date}`,
    venue && `Venue / location: ${venue}`,
    budget && `Budget range: ${budget}`,
    "",
    message,
  ].filter((l): l is string => typeof l === "string");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL ?? "website@bellarawlings.com",
      to: [site.guardianEmail],
      reply_to: email,
      subject: `Booking inquiry: ${eventType} — ${name}`,
      text: lines.join("\n"),
    }),
  });

  if (!res.ok) {
    console.error("Resend booking email failed:", res.status, await res.text());
    return NextResponse.json(
      { error: `Couldn't send right now — email ${site.guardianEmail} directly.` },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}
