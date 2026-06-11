"use client";

import { useEffect } from "react";

/**
 * Official Bandsintown widget — used on /tour when `bandsintownArtist`
 * is set in content/tour.ts. Otherwise the CMS-managed list is shown.
 */
export function BandsintownWidget({ artistName }: { artistName: string }) {
  useEffect(() => {
    const src = "https://widgetv3.bandsintown.com/main.min.js";
    if (!document.querySelector(`script[src="${src}"]`)) {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      document.body.appendChild(s);
    }
  }, []);

  return (
    <a
      className="bit-widget-initializer"
      data-artist-name={artistName}
      data-background-color="transparent"
      data-text-color="#f7f4ef"
      data-link-color="#fb7185"
      data-display-local-dates="false"
      data-display-past-dates="false"
      data-auto-style="false"
    />
  );
}
