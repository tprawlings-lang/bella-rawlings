import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Instagram CDN (Tier 2 live feed thumbnails)
      { protocol: "https", hostname: "*.cdninstagram.com" },
      { protocol: "https", hostname: "*.fbcdn.net" },
      // TikTok CDN (Tier 2 video covers)
      { protocol: "https", hostname: "*.tiktokcdn.com" },
      { protocol: "https", hostname: "*.tiktokcdn-us.com" },
    ],
  },
  async redirects() {
    // Legacy route names from the first architecture doc
    return [
      { source: "/tour", destination: "/shows", permanent: true },
      { source: "/contact", destination: "/book", permanent: true },
    ];
  },
};

export default nextConfig;
