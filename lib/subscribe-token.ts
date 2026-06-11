import { createHmac, timingSafeEqual } from "node:crypto";

/** Signed, expiring tokens for the double opt-in confirmation link. */

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "subscribe";
}

function sign(email: string, expires: number): string {
  return createHmac("sha256", secret()).update(`sub.${email}.${expires}`).digest("hex");
}

export function createSubscribeToken(email: string): string {
  const expires = Date.now() + 24 * 3600_000;
  return `${Buffer.from(email).toString("base64url")}.${expires}.${sign(email, expires)}`;
}

/** Returns the email if the token is valid and unexpired, else null. */
export function verifySubscribeToken(token: string): string | null {
  const [emailB64, expires, sig] = token.split(".");
  if (!emailB64 || !expires || !sig) return null;
  const email = Buffer.from(emailB64, "base64url").toString();
  const expected = sign(email, Number(expires));
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  if (Number(expires) < Date.now()) return null;
  return email;
}
