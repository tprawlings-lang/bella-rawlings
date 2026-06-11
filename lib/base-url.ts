import { site } from "@/content/site";

/**
 * Absolute base URL of the deployed site. OAuth redirect URIs must match
 * what's registered with Meta/TikTok exactly, so this prefers an explicit
 * SITE_URL env var, then the production domain from content/site.ts,
 * then Vercel's preview URL.
 */
export function getBaseUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "production") return site.url;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
