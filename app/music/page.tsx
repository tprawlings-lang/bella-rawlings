import type { Metadata } from "next";
import { releases, type Release } from "@/content/music";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { SpotifyIcon, AppleMusicIcon, YouTubeIcon } from "@/components/SocialIcons";

export const metadata: Metadata = {
  title: "Music — Originals & Covers",
  description: "Original songs and covers, with everywhere to stream them.",
};

function StreamButtons({ links }: { links: Release["links"] }) {
  const buttons = [
    links.spotify && { href: links.spotify, label: "Spotify", Icon: SpotifyIcon },
    links.appleMusic && { href: links.appleMusic, label: "Apple Music", Icon: AppleMusicIcon },
    links.youtube && { href: links.youtube, label: "YouTube", Icon: YouTubeIcon },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof SpotifyIcon }[];

  if (buttons.length === 0) return null;
  return (
    <div className="mt-5 flex flex-wrap gap-3">
      {buttons.map(({ href, label, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full border border-cream/20 px-4 py-2 text-sm transition hover:border-clay hover:text-clay"
        >
          <Icon className="h-4 w-4" />
          {label}
        </a>
      ))}
    </div>
  );
}

function ReleaseEmbed({ release }: { release: Release }) {
  if (release.spotify.id) {
    return <SpotifyEmbed kind={release.spotify.kind} id={release.spotify.id} />;
  }
  if (release.youtubeId) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${release.youtubeId}`}
        title={release.title}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="aspect-video w-full rounded-xl"
      />
    );
  }
  return (
    <div className="stage-glow flex h-40 items-center justify-center rounded-2xl border border-cream/10">
      <p className="text-sm tracking-widest text-cream/50 uppercase">
        Streaming links coming soon
      </p>
    </div>
  );
}

function ReleaseList({ items }: { items: Release[] }) {
  return (
    <div className="space-y-16">
      {items.map((release) => (
        <article
          key={release.title}
          className="grid gap-8 border-t border-cream/10 pt-12 md:grid-cols-2"
        >
          <div>
            <p className="text-sm tracking-[0.3em] text-clay uppercase">
              {release.type} ·{" "}
              {new Date(release.releaseDate + "T00:00:00").toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <h3 className="font-display mt-2 text-4xl font-bold sm:text-5xl">{release.title}</h3>
            <p className="mt-4 max-w-md text-cream/70">{release.description}</p>
            <StreamButtons links={release.links} />
          </div>
          <div>
            <ReleaseEmbed release={release} />
          </div>
        </article>
      ))}
    </div>
  );
}

export default function MusicPage() {
  const originals = releases.filter((r) => r.category === "Original");
  const covers = releases.filter((r) => r.category === "Cover");

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="fade-up font-display text-5xl font-extrabold sm:text-7xl">
        <span className="text-gradient">Music</span>
      </h1>
      <p className="fade-up fade-up-delay-1 mt-4 max-w-xl text-cream/60">
        Originals and covers, newest first — and everywhere you can stream them.
      </p>

      {originals.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-3xl font-bold text-gold">Originals</h2>
          <div className="mt-2">
            <ReleaseList items={originals} />
          </div>
        </section>
      )}

      {covers.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl font-bold text-gold">Covers</h2>
          <div className="mt-2">
            <ReleaseList items={covers} />
          </div>
        </section>
      )}
    </div>
  );
}
