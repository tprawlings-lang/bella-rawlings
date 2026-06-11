/**
 * ─────────────────────────────────────────────────────────────────
 *  MUSIC — everything on the Music page, split into Originals and
 *  Covers (newest first in each). The first Original is also
 *  featured on the home page.
 *
 *  To add a song: copy a block below (from `{` to `},`), paste it at
 *  the TOP of the list, and fill in the details.
 *
 *  spotifyEmbedId: open the song on open.spotify.com — the id is the
 *  long code at the end of the URL.
 *  youtubeId: the code after "watch?v=" in a YouTube URL.
 * ─────────────────────────────────────────────────────────────────
 */

export type Release = {
  title: string;
  category: "Original" | "Cover";
  type: "Single" | "EP" | "Album" | "Video";
  releaseDate: string; // "2026-05-30"
  description: string;
  /** Spotify embed — "track" or "album" + the id. Leave id "" to skip. */
  spotify: { kind: "track" | "album"; id: string };
  /** YouTube embed — used when there's no Spotify id. Leave "" to skip. */
  youtubeId: string;
  /** Streaming links — leave "" to hide a button. */
  links: {
    spotify: string;
    appleMusic: string;
    youtube: string;
  };
};

export const releases: Release[] = [
  {
    title: "Bloom",
    category: "Original",
    type: "Single",
    releaseDate: "2026-05-22",
    description:
      "The new single — written in a Dallas bedroom, meant for the big stage. Out everywhere now.",
    spotify: { kind: "track", id: "" },
    youtubeId: "",
    links: { spotify: "", appleMusic: "", youtube: "" },
  },
  {
    title: "Late Night Demos",
    category: "Original",
    type: "EP",
    releaseDate: "2025-11-14",
    description:
      "Five songs recorded the way they were written: late, honest, and a little unpolished on purpose.",
    spotify: { kind: "album", id: "" },
    youtubeId: "",
    links: { spotify: "", appleMusic: "", youtube: "" },
  },
  {
    title: "Covers, Vol. 1",
    category: "Cover",
    type: "Video",
    releaseDate: "2025-08-01",
    description:
      "The covers that started it all — the songs fans ask for at every show.",
    spotify: { kind: "track", id: "" },
    youtubeId: "",
    links: { spotify: "", appleMusic: "", youtube: "" },
  },
];
