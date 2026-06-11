import Link from "next/link";
import { site } from "@/content/site";
import { SocialIconRow } from "./SocialIcons";
import { EmailSignup } from "./EmailSignup";

export function Footer() {
  return (
    <footer className="border-t border-ink/10">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
          <div className="max-w-md">
            <p className="font-display text-2xl font-bold">{site.artistName}</p>
            <p className="mt-2 text-sm text-ink/50">
              Join the list — new songs, shows, and the occasional secret, straight to your inbox.
            </p>
            <EmailSignup className="mt-5" />
          </div>
          <SocialIconRow />
        </div>
        <div className="mt-12 flex flex-col gap-3 text-xs text-ink/40 sm:flex-row sm:items-center sm:justify-between">
          <p>{site.copyright}</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition hover:text-ink/70">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-ink/70">
              Terms
            </Link>
            <Link href="/merch" className="transition hover:text-ink/70">
              Merch
            </Link>
            <Link href="/admin" className="transition hover:text-ink/70">
              Artist login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
