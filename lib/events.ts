import { shows, type Show } from "@/content/shows";
import { site } from "@/content/site";

/**
 * Calendar helpers: filtering, slugs, ICS generation, Google Calendar
 * links, and schema.org MusicEvent JSON-LD (for Google event search —
 * free Dallas visibility).
 *
 * Show times in content/shows.ts are venue-local (site.timezone).
 * They're kept as "floating" local times with an explicit TZID/ctz so
 * they stay correct regardless of the server's timezone.
 */

const DEFAULT_DURATION_HOURS = 2;

/** Server-local Date — used only for upcoming/past bucketing. */
export function showDate(show: Show): Date {
  return new Date(show.dateTime.replace(" ", "T") + ":00");
}

/** "2026-07-18 19:30" → "20260718T193000" (naive local stamp). */
function localStamp(dateTime: string, addHours = 0): string {
  const [date, time] = dateTime.split(" ");
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  // Naive arithmetic via UTC so DST on the build server can't interfere.
  const t = new Date(Date.UTC(y, m - 1, d, hh + addHours, mm));
  return t.toISOString().slice(0, 19).replace(/[-:]/g, "");
}

export function showSlug(show: Show): string {
  return `${show.dateTime.slice(0, 10)}-${show.venueName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Only confirmed shows are ever published (safety rule from the spec). */
export function publishedShows(): Show[] {
  return shows
    .filter((s) => s.status === "confirmed")
    .sort((a, b) => a.dateTime.localeCompare(b.dateTime));
}

export function upcomingShows(): Show[] {
  const now = Date.now() - 3600_000 * 24;
  return publishedShows().filter((s) => showDate(s).getTime() >= now);
}

export function pastShows(): Show[] {
  const now = Date.now() - 3600_000 * 24;
  return publishedShows()
    .filter((s) => showDate(s).getTime() < now)
    .reverse();
}

// ── Add-to-calendar ─────────────────────────────────────────────────

function icsEscape(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function icsEvent(show: Show): string {
  return [
    "BEGIN:VEVENT",
    `UID:${showSlug(show)}@bellarawlings.com`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`,
    `DTSTART;TZID=${site.timezone}:${localStamp(show.dateTime)}`,
    `DTEND;TZID=${site.timezone}:${localStamp(show.dateTime, DEFAULT_DURATION_HOURS)}`,
    `SUMMARY:${icsEscape(`${site.artistName} — ${show.title}`)}`,
    `LOCATION:${icsEscape(`${show.venueName}, ${show.venueAddress}`)}`,
    `DESCRIPTION:${icsEscape(show.ticketUrl ? `Tickets: ${show.ticketUrl}` : site.url)}`,
    `URL:${site.url}/shows`,
    "END:VEVENT",
  ].join("\r\n");
}

/** Full ICS calendar — one event, or the master feed superfans subscribe to. */
export function buildIcs(events: Show[]): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:-//${site.artistName}//Shows//EN`,
    `X-WR-CALNAME:${site.artistName} — Shows`,
    `X-WR-TIMEZONE:${site.timezone}`,
    ...events.map(icsEvent),
    "END:VCALENDAR",
  ].join("\r\n");
}

export function googleCalendarUrl(show: Show): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${site.artistName} — ${show.title}`,
    dates: `${localStamp(show.dateTime)}/${localStamp(show.dateTime, DEFAULT_DURATION_HOURS)}`,
    ctz: site.timezone,
    location: `${show.venueName}, ${show.venueAddress}`,
    details: show.ticketUrl || site.url,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

// ── Structured data ─────────────────────────────────────────────────

/** schema.org MusicEvent JSON-LD for one show. */
export function musicEventJsonLd(show: Show) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: `${site.artistName} — ${show.title}`,
    // Venue-local time without offset — interpreted as the event's local time.
    startDate: show.dateTime.replace(" ", "T"),
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode:
      show.eventType === "Livestream"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    performer: { "@type": "Person", name: site.artistName },
    location: {
      "@type": "Place",
      name: show.venueName,
      address: show.venueAddress,
    },
    ...(show.ticketUrl
      ? {
          offers: {
            "@type": "Offer",
            url: show.ticketUrl,
            availability: show.soldOut
              ? "https://schema.org/SoldOut"
              : "https://schema.org/InStock",
          },
        }
      : {}),
    organizer: { "@type": "Person", name: site.artistName, url: site.url },
  };
}

/** Sitewide MusicGroup schema with Dallas service area + social profiles. */
export function musicGroupJsonLd() {
  const sameAs = [
    site.socials.tiktok && `https://www.tiktok.com/@${site.socials.tiktok}`,
    site.socials.instagram && `https://www.instagram.com/${site.socials.instagram}`,
    site.socials.youtube && `https://www.youtube.com/@${site.socials.youtube}`,
    site.socials.spotifyArtistId &&
      `https://open.spotify.com/artist/${site.socials.spotifyArtistId}`,
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: site.artistName,
    url: site.url,
    genre: site.genre,
    areaServed: site.areaServed,
    sameAs,
  };
}
