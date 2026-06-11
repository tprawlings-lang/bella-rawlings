import Link from "next/link";
import { site } from "@/content/site";
import { releases } from "@/content/music";
import { epk } from "@/content/epk";
import { upcomingShows, showDate } from "@/lib/events";
import { SocialIconRow } from "@/components/SocialIcons";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { SocialFeed } from "@/components/SocialFeed";
import { EmailSignup } from "@/components/EmailSignup";

export const revalidate = 3600;

function Marquee() {
  const items = Array(8).fill(`${site.artistName} ✦ `);
  return (
    <div className="overflow-hidden border-y border-cream/10 py-3" aria-hidden>
      <div className="animate-marquee flex w-max whitespace-nowrap">
        {[0, 1].map((copy) => (
          <span
            key={copy}
            className="font-display pr-2 text-sm tracking-[0.35em] text-cream/40 uppercase"
          >
            {items.join("")}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const latest = releases[0];
  const nextShows = upcomingShows().slice(0, 3);

  return (
    <>
      {/* Hero — email signup above the fold, per spec */}
      <section className="stage-glow relative">
        <div className="mx-auto flex max-w-6xl flex-col items-start px-5 pt-20 pb-16 sm:pt-28 sm:pb-24">
          <p className="fade-up text-sm tracking-[0.3em] text-cream/50 uppercase">
            {site.tagline} · {site.city}
          </p>
          <h1 className="fade-up fade-up-delay-1 font-display mt-4 text-6xl leading-[0.95] font-extrabold tracking-tight sm:text-8xl lg:text-9xl">
            BELLA
            <br />
            <span className="text-gradient">RAWLINGS</span>
          </h1>
          <div className="fade-up fade-up-delay-2 mt-8 flex flex-wrap items-center gap-5">
            <Link
              href="/music"
              className="bg-gradient-brand rounded-full px-7 py-3 text-sm font-semibold tracking-wide text-ink uppercase transition hover:opacity-90"
            >
              Listen Now
            </Link>
            <Link
              href="/book"
              className="rounded-full border border-cream/25 px-7 py-3 text-sm font-semibold tracking-wide uppercase transition hover:border-clay hover:text-clay"
            >
              Book Her for Your Event
            </Link>
          </div>
          <div className="fade-up fade-up-delay-3 mt-10">
            <p className="text-sm text-cream/50">
              Be first to hear new songs and show announcements:
            </p>
            <EmailSignup className="mt-3" />
            <SocialIconRow className="mt-8" />
          </div>
        </div>
      </section>

      <Marquee />

      {/* Latest release */}
      {latest && (
        <section className="mx-auto max-w-6xl px-5 py-20">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <p className="text-sm tracking-[0.3em] text-clay uppercase">
                Latest {latest.type}
              </p>
              <h2 className="font-display mt-3 text-5xl font-bold sm:text-6xl">{latest.title}</h2>
              <p className="mt-4 max-w-md text-cream/70">{latest.description}</p>
              <Link
                href="/music"
                className="mt-6 inline-block text-sm font-semibold tracking-widest text-gold uppercase transition hover:text-clay"
              >
                All music →
              </Link>
            </div>
            <div>
              {latest.spotify.id ? (
                <SpotifyEmbed kind={latest.spotify.kind} id={latest.spotify.id} />
              ) : (
                <div className="stage-glow flex aspect-square max-h-80 w-full items-center justify-center rounded-2xl border border-cream/10">
                  <p className="font-display px-8 text-center text-2xl font-bold text-cream/60">
                    “{latest.title}” — out{" "}
                    {new Date(latest.releaseDate + "T00:00:00").toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Next 3 shows */}
      {nextShows.length > 0 && (
        <section className="border-y border-cream/10 bg-cream/[0.03]">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-3xl font-bold sm:text-4xl">Upcoming shows</h2>
              <Link
                href="/shows"
                className="text-sm font-semibold tracking-widest text-gold uppercase transition hover:text-clay"
              >
                All dates →
              </Link>
            </div>
            <ul className="mt-6 divide-y divide-cream/10">
              {nextShows.map((show) => {
                const d = showDate(show);
                return (
                  <li
                    key={show.dateTime + show.venueName}
                    className="flex items-center gap-6 py-4"
                  >
                    <div className="w-14 shrink-0 text-center">
                      <p className="text-xs tracking-widest text-clay uppercase">
                        {d.toLocaleDateString("en-US", { month: "short" })}
                      </p>
                      <p className="font-display text-2xl font-bold">{d.getDate()}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="font-display truncate text-lg font-bold">{show.venueName}</p>
                      <p className="truncate text-sm text-cream/60">{show.city}</p>
                    </div>
                    {show.ticketUrl && !show.soldOut && (
                      <a
                        href={show.ticketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto shrink-0 rounded-full border border-cream/25 px-5 py-2 text-xs font-semibold tracking-widest uppercase transition hover:border-clay hover:text-clay"
                      >
                        Tickets
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* Featured social content */}
      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            On <span className="text-gradient">repeat</span>
          </h2>
          <Link
            href="/content"
            className="text-sm font-semibold tracking-widest text-gold uppercase transition hover:text-clay"
          >
            Watch more →
          </Link>
        </div>
        <div className="mt-8">
          <SocialFeed platform="tiktok" limit={3} />
        </div>
      </section>

      {/* Bio teaser */}
      <section className="border-t border-cream/10">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl font-bold sm:text-5xl">The story so far</h2>
            <p className="mt-5 max-w-lg leading-relaxed text-cream/70">{epk.shortBio}</p>
            <Link
              href="/about"
              className="mt-6 inline-block text-sm font-semibold tracking-widest text-gold uppercase transition hover:text-clay"
            >
              About Bella →
            </Link>
          </div>
          <div className="md:pt-3">
            <p className="font-display text-2xl font-bold">Planning an event?</p>
            <p className="mt-2 max-w-sm text-sm text-cream/50">
              Weddings, corporate events, anthems, private parties — {site.artistName} performs
              across {site.areaServed}.
            </p>
            <Link
              href="/book"
              className="bg-gradient-brand mt-5 inline-block rounded-full px-7 py-3 text-sm font-semibold tracking-wide text-ink uppercase transition hover:opacity-90"
            >
              Booking inquiry
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
