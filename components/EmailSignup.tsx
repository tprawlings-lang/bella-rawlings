"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Email-only signup (no age/birthdate fields, by design) with double
 * opt-in: the API sends a confirmation link before anything is stored.
 */
export function EmailSignup({ className = "" }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("done");
        setMessage(data.message ?? "Check your inbox to confirm!");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong — please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong — please try again.");
    }
  }

  if (status === "done") {
    return <p className={`text-sm font-medium text-gold ${className}`}>{message} ♡</p>;
  }

  return (
    <form onSubmit={submit} className={className}>
      <div className="flex max-w-sm gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          aria-label="Email address"
          className="w-full rounded-full border border-cream/20 bg-cream/5 px-4 py-2.5 text-sm placeholder:text-cream/30 focus:border-clay focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-gradient-brand shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold text-ink transition hover:opacity-90 disabled:opacity-50"
        >
          {status === "sending" ? "…" : "Join"}
        </button>
      </div>
      <p className="mt-2 text-[11px] text-cream/35">
        Email only, double opt-in, unsubscribe anytime.{" "}
        <Link href="/privacy" className="underline hover:text-cream/60">
          Privacy
        </Link>
      </p>
      {status === "error" && <p className="mt-2 text-xs text-clay">{message}</p>}
    </form>
  );
}
