import type { Metadata } from "next";
import Image from "next/image";
import { epk } from "@/content/epk";
import { site } from "@/content/site";
import { SocialIconRow } from "@/components/SocialIcons";

export const metadata: Metadata = {
  title: "EPK — Electronic Press Kit",
  description: `Press kit for ${site.artistName}: bio, photos, live video, stats, and booking contact.`,
};

export default function EpkPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <p className="fade-up text-sm tracking-[0.3em] text-clay uppercase">
        Electronic Press Kit
      </p>
      <h1 className="fade-up fade-up-delay-1 font-display mt-3 text-5xl font-extrabold sm:text-7xl">
        {site.artistName}
      </h1>
      <p className="fade-up fade-up-delay-2 mt-2 text-ink/60">
        {site.genre} · {site.city}
      </p>

      {/* Stats */}
      <div className="fade-up fade-up-delay-3 mt-10 grid grid-cols-3 gap-4">
        {epk.stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-ink/10 bg-ink/[0.03] p-5 text-center"
          >
            <p className="font-display text-3xl font-bold text-gold">{s.value}</p>
            <p className="mt-1 text-xs tracking-widest text-ink/50 uppercase">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Bios */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-bold">Short bio</h2>
        <p className="mt-3 leading-relaxed text-ink/75">{epk.shortBio}</p>
        <h2 className="font-display mt-10 text-2xl font-bold">Full bio</h2>
        <div className="mt-3 space-y-4 leading-relaxed text-ink/75">
          {epk.longBio.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Live video */}
      {epk.liveVideoYoutubeIds.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold">Live performance</h2>
          <div className="mt-4 space-y-6">
            {epk.liveVideoYoutubeIds.map((id) => (
              <iframe
                key={id}
                src={`https://www.youtube-nocookie.com/embed/${id}`}
                title={`${site.artistName} live performance`}
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                className="aspect-video w-full rounded-xl"
              />
            ))}
          </div>
        </section>
      )}

      {/* Press */}
      {epk.press.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold">Press</h2>
          <div className="mt-4 space-y-5">
            {epk.press.map((p) => (
              <blockquote key={p.quote} className="border-l-2 border-gold pl-5">
                <p className="font-display text-xl text-ink/85 italic">“{p.quote}”</p>
                <cite className="mt-1 block text-sm text-ink/50 not-italic">— {p.source}</cite>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* Photos */}
      {epk.photos.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold">Press photos</h2>
          <p className="mt-1 text-sm text-ink/50">Click any photo to download the hi-res file.</p>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {epk.photos.map((photo) => (
              <a
                key={photo.file}
                href={`/photos/${photo.file}`}
                download
                className="group relative block aspect-[4/5] overflow-hidden rounded-xl border border-ink/10"
              >
                <Image
                  src={`/photos/${photo.file}`}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Contact — guardian/manager only */}
      <section className="mt-14 rounded-2xl border border-ink/10 bg-ink/[0.03] p-8">
        <h2 className="font-display text-2xl font-bold">Booking & press contact</h2>
        <p className="mt-2 text-sm text-ink/60">
          All inquiries are handled by {site.artistName}&apos;s management:
        </p>
        <a
          href={`mailto:${site.guardianEmail}`}
          className="mt-3 inline-block text-lg font-semibold text-gold transition hover:text-clay"
        >
          {site.guardianEmail}
        </a>
        <div className="mt-6">
          <SocialIconRow />
        </div>
      </section>
    </div>
  );
}
