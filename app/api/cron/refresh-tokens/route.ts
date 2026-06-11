import { NextRequest, NextResponse } from "next/server";
import { refreshInstagramToken } from "@/lib/social/instagram";
import { refreshTikTokToken } from "@/lib/social/tiktok";
import { getToken } from "@/lib/tokens";

/**
 * Weekly Vercel cron (see vercel.json) that keeps long-lived tokens alive:
 *  - Instagram: 60-day token, refreshed weekly so it never lapses.
 *  - TikTok: rotates the refresh token so the 1-year window keeps sliding.
 *
 * Vercel sends `Authorization: Bearer <CRON_SECRET>` automatically when the
 * CRON_SECRET env var is set.
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: Record<string, string> = {};

  try {
    const ig = await refreshInstagramToken();
    results.instagram = ig.refreshed ? `refreshed (${ig.detail})` : `skipped (${ig.detail})`;
  } catch (err) {
    results.instagram = `error: ${err instanceof Error ? err.message : String(err)}`;
  }

  try {
    const existing = await getToken("tiktok");
    if (!existing) {
      results.tiktok = "skipped (not connected)";
    } else {
      const tt = await refreshTikTokToken(existing);
      results.tiktok = tt ? "refreshed" : "refresh failed";
    }
  } catch (err) {
    results.tiktok = `error: ${err instanceof Error ? err.message : String(err)}`;
  }

  return NextResponse.json({ ok: true, results });
}
