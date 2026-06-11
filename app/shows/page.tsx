import type { Metadata } from "next";
import { site } from "@/content/site";
import {
  googleCalendarUrl,
  musicEventJsonLd,
  pastShows,
  showSlug,
  upcomingShows,
} from "@/lib/events";
import { ShowsView, type ShowView } from "@/components/ShowsView";
import type { Show } from "@/content/shows";

export const metadata: Metadata = {
  title: `Shows — Live Music in Dallas–Fort Worth`,
  description: `Upcoming ${site.artistName} performances in Dallas–Fort Worth: dates, venues, and tickets.`,
};

function toView(show: Show): ShowView {
  return {
    title: show.title,
    dateTime: show.dateTime,
    venueName: show.venueName,
    city: show.city,
    ticketUrl: show.ticketUrl,
    eventType: show.eventType,
    soldOut: show.soldOut,
    googleUrl: googleCalendarUrl(show),
    icsUrl: `/api/calendar?event=${showSlug(show)}`,
  };
}

export default function ShowsPage() {
  const upcoming = upcomingShows();
  const past = pastShows();

  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      {/* schema.org MusicEvent for Google's event search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(upcoming.map(musicEventJsonLd)),
        }}
      />
      <h1 className="fade-up font-display text-5xl font-extrabold sm:text-7xl">
        <span className="text-gradient">Shows</span>
      </h1>
      <p className="fade-up fade-up-delay-1 mt-4 max-w-xl text-cream/60">
        Catch {site.artistName} live around {site.areaServed} — and add the dates to your
        calendar so you never miss one.
      </p>

      <div className="fade-up fade-up-delay-2 mt-10">
        <ShowsView
          upcoming={upcoming.map(toView)}
          past={past.map(toView)}
          masterIcsUrl="/api/calendar"
        />
      </div>
    </div>
  );
}
