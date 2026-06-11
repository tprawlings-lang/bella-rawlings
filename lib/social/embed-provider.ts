import { instagramPostUrls, tiktokPostUrls } from "@/content/social-posts";
import type { SocialPlatform, SocialPost, SocialProvider } from "./types";

/**
 * Tier 1: reads post URLs from content/social-posts.ts. The feed component
 * renders these as official TikTok/Instagram embeds — no credentials needed.
 */
export class EmbedProvider implements SocialProvider {
  constructor(public platform: SocialPlatform) {}

  async isConnected(): Promise<boolean> {
    return false;
  }

  async getFeed(limit: number): Promise<SocialPost[]> {
    const urls = this.platform === "tiktok" ? tiktokPostUrls : instagramPostUrls;
    return urls.slice(0, limit).map((url, i) => ({
      id: `embed-${this.platform}-${i}`,
      platform: this.platform,
      url,
    }));
  }
}
