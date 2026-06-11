import type { Metadata } from "next";
import Link from "next/link";
import { about } from "@/content/about";
import { site } from "@/content/site";
import { SocialIconRow } from "@/components/SocialIcons";

export const metadata: Metadata = {
  title: `About — ${site.city} Singer & Songwriter`,
  description: `The story of ${site.artistName}, a singer-songwriter from ${site.city}.`,
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <p className="fade-up text-sm tracking-[0.3em] text-clay uppercase">About Bella</p>
      <h1 className="fade-up fade-up-delay-1 font-display mt-3 text-4xl font-extrabold sm:text-6xl">
        {about.headline}
      </h1>

      <div className="fade-up fade-up-delay-2 mt-10 space-y-6 leading-relaxed text-ink/75">
        {about.story.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {about.influences.length > 0 && (
        <div className="mt-12 border-t border-ink/10 pt-8">
          <p className="text-sm tracking-[0.3em] text-ink/40 uppercase">Influences</p>
          <p className="font-display mt-3 text-2xl font-bold text-gold">
            {about.influences.join(" · ")}
          </p>
        </div>
      )}

      <div className="mt-12 flex flex-wrap items-center gap-8">
        <SocialIconRow />
        <Link
          href="/book"
          className="bg-gradient-brand rounded-full px-7 py-3 text-sm font-semibold tracking-wide text-cream uppercase transition hover:opacity-90"
        >
          Book Her for Your Event
        </Link>
      </div>
    </div>
  );
}
