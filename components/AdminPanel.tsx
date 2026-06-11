"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const inputClass =
  "w-full rounded-xl border border-ink/20 bg-ink/5 px-4 py-3 text-sm placeholder:text-ink/30 focus:border-clay focus:outline-none";

const buttonClass =
  "bg-gradient-brand rounded-full px-6 py-2.5 text-sm font-semibold tracking-wide text-cream uppercase transition hover:opacity-90 disabled:opacity-50";

function ErrorBanner() {
  const params = useSearchParams();
  const error = params.get("error");
  if (!error) return null;
  const messages: Record<string, string> = {
    link_expired: "That sign-in link expired — request a new one below.",
    instagram_auth_failed: "Instagram connection didn't complete. Try again.",
    tiktok_auth_failed: "TikTok connection didn't complete. Try again.",
    instagram_not_configured:
      "Instagram isn't configured yet (INSTAGRAM_CLIENT_ID/SECRET env vars).",
    tiktok_not_configured: "TikTok isn't configured yet (TIKTOK_CLIENT_KEY/SECRET env vars).",
  };
  return (
    <p className="mb-6 rounded-xl border border-clay/40 bg-clay/10 px-4 py-3 text-sm text-clay">
      {messages[error] ?? "Something went wrong."}
    </p>
  );
}

export function AdminMessages() {
  return (
    <Suspense>
      <ErrorBanner />
    </Suspense>
  );
}

export function AdminLogin({
  magicLink,
  password,
}: {
  magicLink: boolean;
  password: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<"email" | "password">(magicLink ? "email" : "password");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/auth/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mode === "email" ? { email: value } : { password: value }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      if (mode === "password") {
        router.refresh();
      } else {
        setStatus("sent");
        setMessage(data.message ?? "Check your email for the sign-in link.");
      }
    } else {
      setStatus("error");
      setMessage(data.error ?? "Sign-in failed.");
    }
  }

  if (status === "sent") {
    return <p className="text-gold">{message}</p>;
  }

  return (
    <form onSubmit={submit} className="max-w-sm space-y-4">
      <input
        type={mode === "email" ? "email" : "password"}
        required
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={mode === "email" ? "Guardian email" : "Admin password"}
        className={inputClass}
      />
      <button type="submit" disabled={status === "sending"} className={buttonClass}>
        {status === "sending"
          ? "…"
          : mode === "email"
            ? "Email me a sign-in link"
            : "Sign in"}
      </button>
      {magicLink && password && (
        <button
          type="button"
          onClick={() => setMode(mode === "email" ? "password" : "email")}
          className="block text-xs text-ink/50 underline hover:text-ink"
        >
          {mode === "email" ? "Use a password instead" : "Use a sign-in link instead"}
        </button>
      )}
      {status === "error" && <p className="text-sm text-clay">{message}</p>}
    </form>
  );
}

export function DisconnectButton({ platform }: { platform: "instagram" | "tiktok" }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/auth/disconnect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ platform }),
        });
        router.refresh();
      }}
      className="text-xs tracking-widest text-ink/50 uppercase underline transition hover:text-clay disabled:opacity-50"
    >
      {busy ? "…" : "Disconnect"}
    </button>
  );
}

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/admin", { method: "DELETE" });
        router.refresh();
      }}
      className="text-xs tracking-widest text-ink/50 uppercase underline transition hover:text-clay"
    >
      Sign out
    </button>
  );
}
