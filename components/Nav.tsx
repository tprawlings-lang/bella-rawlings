"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { site } from "@/content/site";

const navLinks = [
  { href: "/music", label: "Music" },
  { href: "/shows", label: "Shows" },
  { href: "/content", label: "Watch" },
  { href: "/about", label: "About" },
  { href: "/epk", label: "EPK" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-cream/10 bg-ink/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-wide"
          onClick={() => setOpen(false)}
        >
          {site.artistName.toUpperCase()}
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm tracking-widest uppercase transition hover:text-clay ${
                pathname === l.href ? "text-clay" : "text-cream/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="bg-gradient-brand rounded-full px-5 py-2 text-xs font-bold tracking-widest text-ink uppercase transition hover:opacity-90"
          >
            Book Her
          </Link>
        </div>

        <button
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span
            className={`h-0.5 w-6 bg-cream transition ${open ? "translate-y-1 rotate-45" : ""}`}
          />
          <span
            className={`h-0.5 w-6 bg-cream transition ${open ? "-translate-y-1 -rotate-45" : ""}`}
          />
        </button>
      </nav>

      {open && (
        <div className="border-t border-cream/10 bg-ink/95 px-5 pt-2 pb-6 md:hidden">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block py-3 text-lg tracking-widest uppercase ${
                pathname === l.href ? "text-clay" : "text-cream/80"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="bg-gradient-brand mt-4 inline-block rounded-full px-6 py-3 text-sm font-bold tracking-widest text-ink uppercase"
          >
            Book Her for Your Event
          </Link>
        </div>
      )}
    </header>
  );
}
