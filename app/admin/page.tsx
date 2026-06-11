import type { Metadata } from "next";
import {
  adminConfigured,
  isAdminRequest,
  magicLinkConfigured,
  passwordConfigured,
} from "@/lib/admin-auth";
import { getToken, type Platform, type TokenRecord } from "@/lib/tokens";
import {
  AdminLogin,
  AdminMessages,
  DisconnectButton,
  SignOutButton,
} from "@/components/AdminPanel";
import { InstagramIcon, TikTokIcon } from "@/components/SocialIcons";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function ConnectionCard({
  platform,
  label,
  token,
  Icon,
}: {
  platform: Platform;
  label: string;
  token: TokenRecord | null;
  Icon: typeof TikTokIcon;
}) {
  const connected = Boolean(token);
  const expiry =
    token?.expiresAt &&
    new Date(token.expiresAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="rounded-2xl border border-ink/10 bg-ink/[0.03] p-6">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-gold" />
        <h2 className="font-display text-xl font-bold">{label}</h2>
        <span
          className={`ml-auto rounded-full px-3 py-1 text-[11px] font-bold tracking-widest uppercase ${
            connected ? "bg-sage/20 text-sage" : "bg-ink/10 text-ink/50"
          }`}
        >
          {connected ? "Connected" : "Not connected"}
        </span>
      </div>

      {connected ? (
        <div className="mt-4 space-y-1 text-sm text-ink/65">
          {token?.username && (
            <p>
              Account: <span className="font-semibold text-ink">{token.username}</span>
            </p>
          )}
          {expiry && <p>Token auto-renews · current one valid until {expiry}</p>}
          <p className="text-ink/45">The site is showing your live {label} feed.</p>
          <div className="pt-3">
            <DisconnectButton platform={platform} />
          </div>
        </div>
      ) : (
        <div className="mt-4 text-sm text-ink/65">
          <p>
            Connect your {label} so the site shows your latest posts automatically. You&apos;ll
            sign in on {label}&apos;s own page — this site never sees your password.
          </p>
          <a
            href={`/api/auth/${platform}`}
            className="bg-gradient-brand mt-4 inline-block rounded-full px-6 py-2.5 text-sm font-semibold tracking-wide text-cream uppercase transition hover:opacity-90"
          >
            Connect {label}
          </a>
        </div>
      )}
    </div>
  );
}

export default async function AdminPage() {
  const authed = await isAdminRequest();

  if (!authed) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20">
        <h1 className="font-display text-4xl font-extrabold">Artist admin</h1>
        <p className="mt-3 text-sm text-ink/60">
          For Bella and her guardian — manage the site&apos;s social connections here.
        </p>
        <div className="mt-8">
          <AdminMessages />
          {adminConfigured() ? (
            <AdminLogin magicLink={magicLinkConfigured()} password={passwordConfigured()} />
          ) : (
            <p className="rounded-xl border border-ink/15 bg-ink/5 px-4 py-3 text-sm text-ink/60">
              Admin isn&apos;t configured yet. Set <code>ADMIN_SESSION_SECRET</code> plus{" "}
              <code>ADMIN_EMAIL</code> (magic links) or <code>ADMIN_PASSWORD</code> in the
              Vercel environment variables.
            </p>
          )}
        </div>
      </div>
    );
  }

  const [instagram, tiktok] = await Promise.all([getToken("instagram"), getToken("tiktok")]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl font-extrabold">Artist admin</h1>
        <SignOutButton />
      </div>
      <p className="mt-3 max-w-xl text-sm text-ink/60">
        Connect your socials below and the site upgrades from hand-picked embeds to your live
        feeds — automatically, no redeploy. You can disconnect at any time and the site falls
        back to the curated posts.
      </p>

      <AdminMessages />

      <div className="mt-8 grid gap-5">
        <ConnectionCard
          platform="instagram"
          label="Instagram"
          token={instagram}
          Icon={InstagramIcon}
        />
        <ConnectionCard platform="tiktok" label="TikTok" token={tiktok} Icon={TikTokIcon} />
      </div>

      <div className="mt-10 rounded-2xl border border-ink/10 p-6 text-sm text-ink/60">
        <h2 className="font-display text-lg font-bold text-ink">Updating the site</h2>
        <p className="mt-2">
          Shows, music, bio, and the curated post list live in the <code>content/</code> folder
          of the site&apos;s repository — each file has plain-English instructions at the top.
          Edit a file on GitHub and the site redeploys itself in about a minute.
        </p>
      </div>
    </div>
  );
}
