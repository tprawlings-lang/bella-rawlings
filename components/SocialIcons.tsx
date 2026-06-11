import { site } from "@/content/site";

type IconProps = { className?: string };

export function TikTokIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .595.044.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export function InstagramIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YouTubeIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5zM9.6 15.6V8.4L15.8 12l-6.2 3.6z" />
    </svg>
  );
}

export function SpotifyIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.5 17.3a.75.75 0 0 1-1.03.25c-2.82-1.72-6.37-2.11-10.55-1.16a.75.75 0 1 1-.33-1.46c4.57-1.05 8.5-.6 11.66 1.34.35.22.46.68.25 1.03zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.23-1.98-8.15-2.56-11.97-1.4a.94.94 0 1 1-.55-1.79c4.37-1.33 9.79-.69 13.5 1.6.44.27.58.85.31 1.28zm.13-3.4C15.24 8.33 8.84 8.12 5.14 9.24a1.13 1.13 0 1 1-.65-2.15c4.24-1.29 11.3-1.04 15.75 1.6a1.13 1.13 0 0 1-1.14 1.94z" />
    </svg>
  );
}

export function AppleMusicIcon({ className = "h-5 w-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.7 1H6.3A5.3 5.3 0 0 0 1 6.3v11.4A5.3 5.3 0 0 0 6.3 23h11.4a5.3 5.3 0 0 0 5.3-5.3V6.3A5.3 5.3 0 0 0 17.7 1zm-.85 4.28v8.65a2.66 2.66 0 0 1-2.18 2.69c-1.49.3-2.84-.78-2.84-2.2 0-1.2.93-2.1 2.1-2.34l1.35-.27c.33-.07.49-.25.49-.6V7.32c0-.36-.21-.55-.57-.48l-5.39 1.1c-.32.07-.46.25-.46.58v7.45a2.67 2.67 0 0 1-2.18 2.7c-1.5.3-2.85-.79-2.85-2.21 0-1.2.93-2.1 2.1-2.33l1.07-.22c.34-.07.5-.25.5-.6V6.42c0-.5.26-.8.74-.9l7.18-1.46c.6-.12.94.18.94.77z" />
    </svg>
  );
}

const links = (s: typeof site.socials) =>
  [
    s.tiktok && { name: "TikTok", href: `https://www.tiktok.com/@${s.tiktok}`, Icon: TikTokIcon },
    s.instagram && {
      name: "Instagram",
      href: `https://www.instagram.com/${s.instagram}`,
      Icon: InstagramIcon,
    },
    s.youtube && { name: "YouTube", href: `https://www.youtube.com/@${s.youtube}`, Icon: YouTubeIcon },
    s.spotifyArtistId && {
      name: "Spotify",
      href: `https://open.spotify.com/artist/${s.spotifyArtistId}`,
      Icon: SpotifyIcon,
    },
    s.appleMusicArtistUrl && { name: "Apple Music", href: s.appleMusicArtistUrl, Icon: AppleMusicIcon },
  ].filter(Boolean) as { name: string; href: string; Icon: (p: IconProps) => React.JSX.Element }[];

export function SocialIconRow({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-5 ${className}`}>
      {links(site.socials).map(({ name, href, Icon }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${site.artistName} on ${name}`}
          className="text-cream/60 transition hover:text-clay"
        >
          <Icon className="h-6 w-6" />
        </a>
      ))}
    </div>
  );
}
