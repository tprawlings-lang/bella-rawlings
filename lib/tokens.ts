import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Server-side OAuth token storage. Tokens NEVER reach the browser.
 *
 * Storage backends, in order of preference:
 *  1. Vercel KV / Upstash Redis via REST (set KV_REST_API_URL + KV_REST_API_TOKEN).
 *     This is what production should use — survives deploys, supports refresh rotation.
 *  2. Seed tokens from env vars (INSTAGRAM_ACCESS_TOKEN, TIKTOK_ACCESS_TOKEN,
 *     TIKTOK_REFRESH_TOKEN) — the "simple" option; fine for Instagram's 60-day
 *     tokens, but refreshed values can't be written back to env vars.
 *  3. A local .tokens.json file — local development only.
 */

export type Platform = "instagram" | "tiktok";

export type TokenRecord = {
  accessToken: string;
  refreshToken?: string;
  /** Unix ms when the access token expires. Undefined = unknown/long-lived. */
  expiresAt?: number;
  /** Unix ms when the refresh token expires (TikTok rotates these). */
  refreshExpiresAt?: number;
  /** Connected account's username/display name, for the admin page. */
  username?: string;
  obtainedAt: number;
};

const kvUrl = process.env.KV_REST_API_URL;
const kvToken = process.env.KV_REST_API_TOKEN;
const LOCAL_FILE = path.join(process.cwd(), ".tokens.json");

function kvKey(platform: Platform) {
  return `social:token:${platform}`;
}

async function kvCommand<T>(command: (string | number)[]): Promise<T | null> {
  const res = await fetch(kvUrl!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${kvToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { result: T };
  return data.result;
}

async function readLocalFile(): Promise<Partial<Record<Platform, TokenRecord>>> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8"));
  } catch {
    return {};
  }
}

function envSeedToken(platform: Platform): TokenRecord | null {
  if (platform === "instagram" && process.env.INSTAGRAM_ACCESS_TOKEN) {
    return {
      accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
      obtainedAt: 0,
    };
  }
  if (platform === "tiktok" && process.env.TIKTOK_ACCESS_TOKEN) {
    return {
      accessToken: process.env.TIKTOK_ACCESS_TOKEN,
      refreshToken: process.env.TIKTOK_REFRESH_TOKEN,
      obtainedAt: 0,
    };
  }
  return null;
}

export async function getToken(platform: Platform): Promise<TokenRecord | null> {
  if (kvUrl && kvToken) {
    const raw = await kvCommand<string | null>(["GET", kvKey(platform)]);
    if (raw) return JSON.parse(raw) as TokenRecord;
    return envSeedToken(platform);
  }
  if (process.env.NODE_ENV !== "production") {
    const file = await readLocalFile();
    if (file[platform]) return file[platform]!;
  }
  return envSeedToken(platform);
}

export async function saveToken(platform: Platform, record: TokenRecord): Promise<void> {
  if (kvUrl && kvToken) {
    await kvCommand(["SET", kvKey(platform), JSON.stringify(record)]);
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    const file = await readLocalFile();
    file[platform] = record;
    await fs.writeFile(LOCAL_FILE, JSON.stringify(file, null, 2));
    return;
  }
  throw new Error(
    "No token storage configured. Add a Vercel KV / Upstash Redis integration " +
      "(KV_REST_API_URL + KV_REST_API_TOKEN) to store OAuth tokens in production."
  );
}

export async function deleteToken(platform: Platform): Promise<void> {
  if (kvUrl && kvToken) {
    await kvCommand(["DEL", kvKey(platform)]);
    return;
  }
  if (process.env.NODE_ENV !== "production") {
    const file = await readLocalFile();
    delete file[platform];
    await fs.writeFile(LOCAL_FILE, JSON.stringify(file, null, 2));
  }
}
