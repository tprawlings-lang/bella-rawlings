import type { Metadata } from "next";
import { site } from "@/content/site";
import { SocialFeed } from "@/components/SocialFeed";
import { InstagramIcon, TikTokIcon } from "@/components/SocialIcons";

export const metadata: Metadata = {
  title: "Watch",
  description: "The latest from TikTok and Instagram.",
};

export const revalidate = 3600;

export default function ContentPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="fade-up font-display text-5xl font-extrabold sm:text-7xl">
        <span className="text-gradient">Watch</span>
      </h1>
      <p className="fade-up fade-up-delay-1 mt-4 max-w-xl text-ink/60">
        The latest from TikTok and Instagram — covers, originals, and everything in between.
      </p>

      <section className="mt-14">
        <div className="flex items-center gap-3">
          <TikTokIcon className="h-6 w-6 text-clay" />
          <h2 className="font-display text-3xl font-bold">TikTok</h2>
          <a
            href={`https://www.tiktok.com/@${site.socials.tiktok}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-sm font-semibold tracking-widest text-gold uppercase transition hover:text-clay"
          >
            @{site.socials.tiktok} →
          </a>
        </div>
        <div className="mt-6">
          <SocialFeed platform="tiktok" limit={9} />
        </div>
      </section>

      <section className="mt-20">
        <div className="flex items-center gap-3">
          <InstagramIcon className="h-6 w-6 text-clay" />
          <h2 className="font-display text-3xl font-bold">Instagram</h2>
          <a
            href={`https://www.instagram.com/${site.socials.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-sm font-semibold tracking-widest text-gold uppercase transition hover:text-clay"
          >
            @{site.socials.instagram} →
          </a>
        </div>
        <div className="mt-6">
          <SocialFeed platform="instagram" limit={9} />
        </div>
      </section>
    </div>
  );
}
