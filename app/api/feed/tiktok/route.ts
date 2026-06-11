import { NextResponse } from "next/server";
import { getFeed } from "@/lib/social";

/** Cached TikTok feed endpoint (proxies the platform API; tokens stay server-side). */
export async function GET() {
  const feed = await getFeed("tiktok", 12);
  return NextResponse.json(feed, {
    headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
  });
}
