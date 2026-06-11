import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/music", "/shows", "/content", "/about", "/epk", "/book", "/merch", "/privacy", "/terms"];
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/shows" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/book" || route === "/shows" ? 0.9 : 0.7,
  }));
}
