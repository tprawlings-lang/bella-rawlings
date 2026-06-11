import Image from "next/image";
import { site } from "@/content/site";
import { getFeed, type SocialPlatform, type SocialPost } from "@/lib/social";
import { SocialEmbed } from "./SocialEmbed";
import { InstagramIcon, TikTokIcon } from "./SocialIcons";

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

/** Tier 2 card: live API data with thumbnail, linking to the post. */
function FeedCard({ post }: { post: SocialPost }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-[3/4] overflow-hidden rounded-xl border border-cream/10 bg-cream/5"
    >
      {post.thumbnailUrl ? (
        <Image
          src={post.thumbnailUrl}
          alt={post.caption ?? `${site.artistName} on ${post.platform}`}
          fill
          sizes="(max-width: 640px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="stage-glow absolute inset-0" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
      <div className="absolute right-0 bottom-0 left-0 p-3">
        {post.caption && (
          <p className="line-clamp-2 text-xs text-cream/90">{post.caption}</p>
        )}
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-cream/60">
          {post.platform === "tiktok" ? (
            <TikTokIcon className="h-3.5 w-3.5" />
          ) : (
            <InstagramIcon className="h-3.5 w-3.5" />
          )}
          {post.viewCount !== undefined && <span>{formatViews(post.viewCount)} views</span>}
        </div>
      </div>
    </a>
  );
}

function FollowCta({ platform }: { platform: SocialPlatform }) {
  const handle = platform === "tiktok" ? site.socials.tiktok : site.socials.instagram;
  const href =
    platform === "tiktok"
      ? `https://www.tiktok.com/@${handle}`
      : `https://www.instagram.com/${handle}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-cream/20 px-6 py-12 text-center transition hover:border-clay/60"
    >
      {platform === "tiktok" ? (
        <TikTokIcon className="h-8 w-8 text-cream/60" />
      ) : (
        <InstagramIcon className="h-8 w-8 text-cream/60" />
      )}
      <span className="text-sm text-cream/60">
        Follow <span className="font-semibold text-cream">@{handle}</span> on{" "}
        {platform === "tiktok" ? "TikTok" : "Instagram"}
      </span>
    </a>
  );
}

/**
 * Server component for one platform's feed. Checks the provider and renders:
 *  - Tier 2 (connected): live thumbnails from the platform API
 *  - Tier 1 (not connected): official embeds of hand-picked post URLs
 *  - Neither: a follow CTA so the section never looks broken
 */
export async function SocialFeed({
  platform,
  limit = 6,
}: {
  platform: SocialPlatform;
  limit?: number;
}) {
  const feed = await getFeed(platform, limit);

  if (feed.posts.length === 0) {
    return <FollowCta platform={platform} />;
  }

  if (feed.tier === 2) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {feed.posts.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {feed.posts.map((post) => (
        <SocialEmbed key={post.id} url={post.url} />
      ))}
    </div>
  );
}
