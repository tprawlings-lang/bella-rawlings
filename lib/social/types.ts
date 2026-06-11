export type SocialPlatform = "instagram" | "tiktok";

export type SocialPost = {
  id: string;
  platform: SocialPlatform;
  /** Permalink to the post on the platform. */
  url: string;
  caption?: string;
  thumbnailUrl?: string;
  /** ISO date string. */
  timestamp?: string;
  viewCount?: number;
};

/**
 * One interface, two tiers. The front end never cares which is active:
 *  - EmbedProvider (Tier 1): post URLs hand-entered in content/social-posts.ts,
 *    rendered as official native embeds. Zero credentials.
 *  - InstagramProvider / TikTokProvider (Tier 2): live feeds via OAuth tokens
 *    the artist grants herself on /admin. No passwords ever shared.
 */
export interface SocialProvider {
  platform: SocialPlatform;
  isConnected(): Promise<boolean>;
  getFeed(limit: number): Promise<SocialPost[]>;
}

export type FeedResult = {
  platform: SocialPlatform;
  /** 2 = live API feed (connected), 1 = manual embeds. */
  tier: 1 | 2;
  posts: SocialPost[];
};
