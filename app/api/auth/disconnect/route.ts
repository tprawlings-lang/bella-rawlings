import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { deleteToken } from "@/lib/tokens";

/** Disconnects a platform (deletes its stored token). Admin only. */
export async function POST(request: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { platform } = (await request.json().catch(() => ({}))) as { platform?: string };
  if (platform !== "instagram" && platform !== "tiktok") {
    return NextResponse.json({ error: "Unknown platform" }, { status: 400 });
  }
  await deleteToken(platform);
  return NextResponse.json({ ok: true });
}
