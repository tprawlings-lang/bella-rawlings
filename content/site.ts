/**
 * ─────────────────────────────────────────────────────────────────
 *  SITE SETTINGS — edit this file to update the whole site.
 *  No code knowledge needed: change the text between the quotes.
 *
 *  SAFETY NOTE (Bella is a minor — these rules are non-negotiable):
 *   • Only the guardian/manager email ever appears on this site.
 *   • Never add her personal email, phone number, school name, or
 *     home address anywhere in this folder.
 *   • Photos: performance/promo shots only — no geotags, no school
 *     identifiers, no real-time location.
 * ─────────────────────────────────────────────────────────────────
 */

export const site = {
  /** Artist name, used everywhere (nav, hero, page titles). */
  artistName: "Bella Rawlings",

  /** Short tagline shown under the name on the home page. */
  tagline: "Singer. Songwriter. Storyteller.",

  /** SEO title for the home page — keep "Dallas Singer & Songwriter" for local search. */
  seoTitle: "Bella Rawlings | Dallas Singer & Songwriter",

  /** One-sentence description used for search engines and link previews. */
  description:
    "Bella Rawlings is a Dallas, Texas singer-songwriter performing covers and original music. Book her for weddings, corporate events, anthems, and private parties across DFW.",

  /** Where she's based — woven into SEO schema and page copy. */
  city: "Dallas, TX",
  /** IANA timezone for show times (calendar feeds + event schema). */
  timezone: "America/Chicago",
  areaServed: "Dallas–Fort Worth, TX",
  genre: "Pop / Singer-Songwriter",

  /** The live domain (used for SEO tags and the sitemap). */
  url: "https://bellarawlings.com",

  /**
   * Social handles — just the username, no @ and no URL.
   * Leave a value as "" to hide that icon site-wide.
   */
  socials: {
    tiktok: "bellarawlings",
    instagram: "bellarawlings",
    youtube: "",
    spotifyArtistId: "", // the long id from open.spotify.com/artist/<id>
    appleMusicArtistUrl: "",
  },

  /**
   * GUARDIAN/MANAGER EMAIL — all booking and business inquiries go here.
   * This must be a parent/guardian or manager address, never Bella's own.
   */
  guardianEmail: "booking@bellarawlings.com",

  /**
   * The entity that operates this site (shown on /privacy and /terms).
   * Use the guardian/manager name or business entity — not the artist.
   */
  siteOperator: "The Rawlings Family (guardian/manager)",

  /**
   * Mailing address for the email-footer/legal pages if ever needed.
   * MUST be a PO box, registered agent, or manager's business address —
   * never the family home. Leave "" to omit.
   */
  businessAddress: "",

  /**
   * Merch: if Bella opens a Shopify / Printful / Bandcamp store later,
   * paste the store URL here and the Merch page will link out to it.
   * Leave "" to show the "coming soon" merch page.
   */
  merchUrl: "",

  /** Footer line. */
  copyright: `© ${new Date().getFullYear()} Bella Rawlings. All rights reserved.`,
};

export type Site = typeof site;
