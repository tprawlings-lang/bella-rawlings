import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${site.url}.`,
};

/**
 * Plain-language privacy policy per the minor-artist spec: states exactly
 * what is collected (email only), why, and how a parent can request
 * deletion. The site operator is the guardian/manager — not the artist.
 */
export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Privacy Policy</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-cream/75">
        <p>
          This website is operated by {site.siteOperator} on behalf of the artist{" "}
          {site.artistName}. We keep things simple and collect as little as possible.
        </p>

        <h2 className="font-display pt-2 text-xl font-bold text-cream">What we collect</h2>
        <p>
          <strong>Mailing list:</strong> your email address — and nothing else. No names, ages,
          birthdates, or locations. We use double opt-in: nothing is stored until you click the
          confirmation link we email you.
        </p>
        <p>
          <strong>Booking form:</strong> the contact and event details you choose to send us.
          They are delivered by email to the artist&apos;s management and are not stored on this
          website.
        </p>
        <p>
          <strong>Analytics:</strong> we use cookieless, privacy-friendly analytics (Vercel
          Analytics) to count page visits. We do not use advertising or retargeting pixels, and
          we do not sell or share any data.
        </p>

        <h2 className="font-display pt-2 text-xl font-bold text-cream">Why we collect it</h2>
        <p>
          The mailing list is used only to send updates about new music, shows, and merch. The
          booking form is used only to respond to your inquiry.
        </p>

        <h2 className="font-display pt-2 text-xl font-bold text-cream">
          Unsubscribing & deletion
        </h2>
        <p>
          Every email we send includes an unsubscribe link. Parents and guardians: if your child
          joined the mailing list and you&apos;d like their address removed, email{" "}
          <a href={`mailto:${site.guardianEmail}`} className="text-gold underline">
            {site.guardianEmail}
          </a>{" "}
          and we will delete it promptly.
        </p>

        <h2 className="font-display pt-2 text-xl font-bold text-cream">Third-party services</h2>
        <p>
          Pages on this site may embed content from TikTok, Instagram, Spotify, and YouTube.
          When you interact with those embeds, those platforms&apos; own privacy policies apply.
        </p>

        <h2 className="font-display pt-2 text-xl font-bold text-cream">Contact</h2>
        <p>
          Questions about this policy:{" "}
          <a href={`mailto:${site.guardianEmail}`} className="text-gold underline">
            {site.guardianEmail}
          </a>
          .
        </p>
        <p className="text-cream/40">Last updated: June 2026</p>
      </div>
    </div>
  );
}
