import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms of use for ${site.url}.`,
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Terms of Use</h1>
      <div className="mt-8 space-y-6 text-sm leading-relaxed text-cream/75">
        <p>
          Welcome to {site.url}, the official website of {site.artistName}, operated by{" "}
          {site.siteOperator}. By using this site you agree to these terms.
        </p>

        <h2 className="font-display pt-2 text-xl font-bold text-cream">Content & ownership</h2>
        <p>
          All music, lyrics, photos, videos, and text on this site are the property of{" "}
          {site.artistName} and her family or their respective rights holders. Press photos on
          the EPK page may be downloaded and used for legitimate press and event-promotion
          purposes with credit. Any other reproduction or commercial use requires written
          permission via{" "}
          <a href={`mailto:${site.guardianEmail}`} className="text-gold underline">
            {site.guardianEmail}
          </a>
          .
        </p>

        <h2 className="font-display pt-2 text-xl font-bold text-cream">A publish-only site</h2>
        <p>
          This site doesn&apos;t offer user accounts, comments, or direct messaging. Fan
          interaction happens on the artist&apos;s official, moderated social channels.
        </p>

        <h2 className="font-display pt-2 text-xl font-bold text-cream">Bookings</h2>
        <p>
          Booking inquiries submitted through this site are requests, not confirmed engagements.
          All bookings are arranged and contracted by the artist&apos;s management.
        </p>

        <h2 className="font-display pt-2 text-xl font-bold text-cream">External links & embeds</h2>
        <p>
          The site links to and embeds content from third-party platforms (TikTok, Instagram,
          Spotify, YouTube, ticket vendors). We aren&apos;t responsible for those platforms&apos;
          content or practices.
        </p>

        <h2 className="font-display pt-2 text-xl font-bold text-cream">Changes</h2>
        <p>
          We may update these terms from time to time; the latest version always lives at this
          page.
        </p>
        <p className="text-cream/40">Last updated: June 2026</p>
      </div>
    </div>
  );
}
