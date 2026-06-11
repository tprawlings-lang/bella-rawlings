import { NextRequest } from "next/server";
import { buildIcs, publishedShows, showSlug, upcomingShows } from "@/lib/events";

/**
 * ICS calendar:
 *  - /api/calendar           → master feed (superfans subscribe once)
 *  - /api/calendar?event=ID  → single-event .ics download
 */
export async function GET(request: NextRequest) {
  const eventId = request.nextUrl.searchParams.get("event");
  const events = eventId
    ? publishedShows().filter((s) => showSlug(s) === eventId)
    : upcomingShows();

  return new Response(buildIcs(events), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="bella-rawlings${eventId ? `-${eventId}` : "-shows"}.ics"`,
      "Cache-Control": "public, s-maxage=3600",
    },
  });
}
