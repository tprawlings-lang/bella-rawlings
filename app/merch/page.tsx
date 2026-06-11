import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { site } from "@/content/site";
import { EmailSignup } from "@/components/EmailSignup";

export const metadata: Metadata = {
  title: "Merch",
  description: `${site.artistName} merchandise.`,
};

export default function MerchPage() {
  // When the store opens, set merchUrl in content/site.ts and this
  // page sends fans straight there.
  if (site.merchUrl) redirect(site.merchUrl);

  return (
    <div className="mx-auto max-w-3xl px-5 py-24 text-center">
      <h1 className="fade-up font-display text-5xl font-extrabold sm:text-7xl">
        <span className="text-gradient">Merch</span>
      </h1>
      <p className="fade-up fade-up-delay-1 mt-6 text-cream/60">
        The BR collection is in the works — hats, hoodies, and a few things we&apos;re keeping
        secret. Join the list and you&apos;ll know the moment it drops.
      </p>
      <div className="fade-up fade-up-delay-2 mt-8 flex justify-center">
        <EmailSignup />
      </div>
    </div>
  );
}
