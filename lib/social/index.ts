import { EmbedProvider } from "./embed-provider";
import { InstagramProvider } from "./instagram";
import { TikTokProvider } from "./tiktok";
import type { FeedResult, SocialPlatform } from "./types";

export type { FeedResult, SocialPost, SocialPlatform, SocialProvider } from "./types";

const live = {
  instagram: new InstagramProvider(),
  tiktok: new TikTokProvider(),
} as const;

/**
 * The automatic Tier 1 → Tier 2 upgrade: if the artist has connected the
 * platform on /admin (tokens exist server-side), serve the live API feed;
 * otherwise fall back to the hand-picked embed URLs from the content files.
 * No redeploy needed when she connects.
 */
export async function getFeed(platform: SocialPlatform, limit = 9): Promise<FeedResult> {
  const provider = live[platform];
  try {
    if (await provider.isConnected()) {
      const posts = await provider.getFeed(limit);
      if (posts.length > 0) return { platform, tier: 2, posts };
    }
  } catch (err) {
    console.error(`${platform} live feed unavailable, falling back to embeds:`, err);
  }
  const posts = await new EmbedProvider(platform).getFeed(limit);
  return { platform, tier: 1, posts };
}
