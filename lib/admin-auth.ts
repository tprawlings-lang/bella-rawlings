import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Auth for the /admin page, designed for the guardian handoff:
 *
 *  - Magic link (preferred, per spec): set ADMIN_EMAIL to the
 *    guardian/manager email + RESEND_API_KEY. The guardian enters the
 *    email on /admin and gets a sign-in link — nothing to remember.
 *  - Password (fallback / local dev): set ADMIN_PASSWORD.
 *
 * Sessions and magic links are HMAC-signed expiry timestamps —
 * no session table, nothing to clean up. Set ADMIN_SESSION_SECRET to
 * any long random string (required for magic-link-only setups).
 */

export const ADMIN_COOKIE = "bella_admin_session";
const SESSION_HOURS = 24 * 7;
const MAGIC_LINK_MINUTES = 15;

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("Set ADMIN_SESSION_SECRET (or ADMIN_PASSWORD) in the environment");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD);
}

export function magicLinkConfigured(): boolean {
  return Boolean(process.env.ADMIN_EMAIL && process.env.RESEND_API_KEY && adminConfigured());
}

export function passwordConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function isAdminEmail(email: string): boolean {
  const expected = process.env.ADMIN_EMAIL;
  return Boolean(expected && email.trim().toLowerCase() === expected.trim().toLowerCase());
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected && safeEqual(password, expected));
}

// ── Sessions ────────────────────────────────────────────────────────

export function createSessionValue(): string {
  const payload = `s.${Date.now() + SESSION_HOURS * 3600_000}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidSessionValue(value: string | undefined): boolean {
  if (!value || !adminConfigured()) return false;
  const [kind, expires, sig] = value.split(".");
  if (kind !== "s" || !expires || !sig) return false;
  return safeEqual(sig, sign(`s.${expires}`)) && Number(expires) > Date.now();
}

export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  return isValidSessionValue(store.get(ADMIN_COOKIE)?.value);
}

// ── Magic links ─────────────────────────────────────────────────────

export function createMagicToken(): string {
  const payload = `m.${Date.now() + MAGIC_LINK_MINUTES * 60_000}`;
  return `${payload}.${sign(payload)}`;
}

export function isValidMagicToken(token: string | null): boolean {
  if (!token || !adminConfigured()) return false;
  const [kind, expires, sig] = token.split(".");
  if (kind !== "m" || !expires || !sig) return false;
  return safeEqual(sig, sign(`m.${expires}`)) && Number(expires) > Date.now();
}
