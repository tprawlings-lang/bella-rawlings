import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminConfigured,
  createMagicToken,
  createSessionValue,
  isAdminEmail,
  magicLinkConfigured,
  passwordConfigured,
  verifyPassword,
} from "@/lib/admin-auth";
import { getBaseUrl } from "@/lib/base-url";
import { site } from "@/content/site";

function sessionResponse(body: object) {
  const res = NextResponse.json(body);
  res.cookies.set(ADMIN_COOKIE, createSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 3600,
  });
  return res;
}

/**
 * Admin sign-in. Two modes:
 *  - { email }: sends a magic sign-in link to the guardian email
 *    (must match ADMIN_EMAIL; requires RESEND_API_KEY).
 *  - { password }: direct sign-in when ADMIN_PASSWORD is set.
 */
export async function POST(request: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Admin is not configured. Set ADMIN_SESSION_SECRET (and ADMIN_EMAIL or ADMIN_PASSWORD)." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };

  if (body.password !== undefined) {
    if (!passwordConfigured() || !verifyPassword(body.password)) {
      return NextResponse.json({ error: "Wrong password." }, { status: 401 });
    }
    return sessionResponse({ ok: true, mode: "password" });
  }

  if (body.email !== undefined) {
    if (!magicLinkConfigured()) {
      return NextResponse.json(
        { error: "Magic links aren't configured. Set ADMIN_EMAIL and RESEND_API_KEY." },
        { status: 503 }
      );
    }
    // Always answer the same way so the endpoint can't be used to
    // discover the guardian email.
    const generic = {
      ok: true,
      message: "If that's the right email, a sign-in link is on its way.",
    };
    if (!isAdminEmail(body.email)) return NextResponse.json(generic);

    const link = `${getBaseUrl()}/api/auth/admin/verify?token=${encodeURIComponent(createMagicToken())}`;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL ?? `website@bellarawlings.com`,
        to: [process.env.ADMIN_EMAIL],
        subject: `Sign in to ${site.artistName} admin`,
        text:
          `Click to sign in to the ${site.artistName} website admin:\n\n${link}\n\n` +
          `This link works for 15 minutes. If you didn't request it, you can ignore this email.`,
      }),
    });
    if (!res.ok) {
      console.error("Magic link email failed:", res.status, await res.text());
      return NextResponse.json({ error: "Couldn't send the email — try again." }, { status: 502 });
    }
    return NextResponse.json(generic);
  }

  return NextResponse.json({ error: "Provide an email or password." }, { status: 400 });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
