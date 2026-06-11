import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { site } from "@/content/site";
import { musicGroupJsonLd } from "@/lib/events";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "./globals.css";

// Brand kit typography: Playfair Display (display) + Montserrat (body)
const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display-var",
});

const body = Montserrat({
  subsets: ["latin"],
  variable: "--font-body-var",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.seoTitle,
    template: `%s — ${site.artistName}`,
  },
  description: site.description,
  openGraph: {
    title: site.seoTitle,
    description: site.description,
    url: site.url,
    siteName: site.artistName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: site.seoTitle,
    description: site.description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col">
        {/* Sitewide MusicGroup schema: Dallas–Fort Worth service area + socials */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(musicGroupJsonLd()) }}
        />
        <Nav />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
