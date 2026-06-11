/**
 * ─────────────────────────────────────────────────────────────────
 *  SHOWS — the performance calendar (/shows page + home page).
 *
 *  To add a show: copy a block below and fill it in.
 *  Past shows move to the archive automatically — don't delete them,
 *  the archive builds credibility and Dallas search presence.
 *
 *  SAFETY RULE: only list confirmed PUBLIC performances (or a
 *  private-event availability note). Shows with status "tentative"
 *  are hidden from the site until you change them to "confirmed".
 *  Never publish family or school events.
 * ─────────────────────────────────────────────────────────────────
 */

export type EventType = "Public show" | "Private event" | "Livestream" | "Competition";

export type Show = {
  title: string;
  /** Date and start time, 24h local: "2026-07-18 19:30" */
  dateTime: string;
  venueName: string;
  /** Street address — used for Google event search. Public venues only. */
  venueAddress: string;
  city: string;
  /** Ticket or RSVP link — leave "" if not on sale yet. */
  ticketUrl: string;
  eventType: EventType;
  /** Only "confirmed" shows appear on the site. */
  status: "confirmed" | "tentative";
  soldOut?: boolean;
};

export const shows: Show[] = [
  {
    title: "Live at Deep Ellum Art Co.",
    dateTime: "2026-07-18 19:30",
    venueName: "Deep Ellum Art Co.",
    venueAddress: "3200 Commerce St, Dallas, TX 75226",
    city: "Dallas, TX",
    ticketUrl: "",
    eventType: "Public show",
    status: "confirmed",
  },
  {
    title: "Acoustic Evening",
    dateTime: "2026-08-08 18:00",
    venueName: "Klyde Warren Park",
    venueAddress: "2012 Woodall Rodgers Fwy, Dallas, TX 75201",
    city: "Dallas, TX",
    ticketUrl: "",
    eventType: "Public show",
    status: "confirmed",
  },
];
