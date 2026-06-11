/**
 * ─────────────────────────────────────────────────────────────────
 *  ELECTRONIC PRESS KIT — bio, stats, press quotes, photos, video.
 *  This feeds the /epk page that gets sent to venues, blogs, labels.
 *
 *  SAFETY: the only contact on the EPK is the guardian/manager email
 *  (set in content/site.ts). Photos must be performance/promo shots
 *  only — no geotags or school identifiers.
 * ─────────────────────────────────────────────────────────────────
 */

export const epk = {
  /** Short bio — one paragraph, used at the top of the EPK and on Home. */
  shortBio:
    "Bella Rawlings is a Dallas-based singer-songwriter turning everyday moments into songs people can't stop replaying. With a voice that cuts straight through the noise and a songbook that's equal parts diary and anthem, she's building a fanbase one chorus at a time.",

  /** Long bio — the full story for press. Add paragraphs to the list. */
  longBio: [
    "Bella Rawlings writes the kind of songs that feel like they were pulled from your own camera roll — specific enough to be hers, universal enough to be yours.",
    "What started as voice memos and bedroom covers has grown into original releases, live shows across Dallas–Fort Worth, and a fast-growing community on TikTok and Instagram, where fans show up first for the voice and stay for the writing.",
    "She is currently writing and recording her next project.",
  ],

  /**
   * One or more live performance videos (YouTube ids — the code after
   * "watch?v=" in the URL). Venues want to see her live.
   */
  liveVideoYoutubeIds: [] as string[],

  /**
   * Quick stats for the press kit. Update these as the numbers grow —
   * keep them honest, bookers do check.
   */
  stats: [
    { label: "TikTok followers", value: "—" },
    { label: "Instagram followers", value: "—" },
    { label: "Monthly listeners", value: "—" },
  ],

  /** Press quotes. Add them as they come in. */
  press: [
    // { quote: "A voice you don't forget.", source: "Local Scene Weekly" },
  ] as { quote: string; source: string }[],

  /**
   * Press photos — put hi-res image files in /public/photos, then list
   * them here. Include at least one horizontal and one vertical.
   * Write alt text like "Bella Rawlings performing at [venue], Dallas TX".
   */
  photos: [] as { file: string; alt: string; orientation: "horizontal" | "vertical" }[],
};
