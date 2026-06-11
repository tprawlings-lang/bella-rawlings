"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

function loadScript(src: string, onLoad?: () => void) {
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) {
    onLoad?.();
    return;
  }
  const s = document.createElement("script");
  s.src = src;
  s.async = true;
  if (onLoad) s.onload = onLoad;
  document.body.appendChild(s);
}

/**
 * Tier 1: official native embeds rendered from a plain post URL.
 * No credentials, no API keys — works the day the site launches.
 */
export function SocialEmbed({ url }: { url: string }) {
  const isTikTok = url.includes("tiktok.com");

  useEffect(() => {
    if (isTikTok) {
      loadScript("https://www.tiktok.com/embed.js");
    } else {
      loadScript("https://www.instagram.com/embed.js", () =>
        window.instgrm?.Embeds.process()
      );
      window.instgrm?.Embeds.process();
    }
  }, [isTikTok, url]);

  if (isTikTok) {
    const videoId = url.match(/\/video\/(\d+)/)?.[1] ?? "";
    return (
      <blockquote
        className="tiktok-embed"
        cite={url}
        data-video-id={videoId}
        style={{ maxWidth: 605, minWidth: 280, margin: 0 }}
      >
        <section>
          <a href={url} target="_blank" rel="noopener noreferrer">
            Watch on TikTok
          </a>
        </section>
      </blockquote>
    );
  }

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ maxWidth: 540, minWidth: 280, margin: 0, width: "100%" }}
    >
      <a href={url} target="_blank" rel="noopener noreferrer">
        View on Instagram
      </a>
    </blockquote>
  );
}
