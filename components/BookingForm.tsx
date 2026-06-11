"use client";

import { useState } from "react";

const EVENT_TYPES = [
  "Wedding",
  "Corporate event",
  "Private party",
  "National anthem",
  "Festival / market",
  "Venue / public show",
  "Other",
];

const BUDGETS = ["Under $500", "$500–$1,000", "$1,000–$2,500", "$2,500+", "Not sure yet"];

const inputClass =
  "w-full rounded-xl border border-cream/20 bg-cream/5 px-4 py-3 text-sm placeholder:text-cream/30 focus:border-clay focus:outline-none";

export function BookingForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("done");
      } else {
        setStatus("error");
        setError(data.error ?? "Something went wrong — please try again.");
      }
    } catch {
      setStatus("error");
      setError("Something went wrong — please try again.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-gold/40 bg-gold/10 p-8 text-center">
        <p className="font-display text-2xl font-bold">Inquiry sent!</p>
        <p className="mt-2 text-sm text-cream/70">
          Thanks for reaching out — Bella&apos;s management will reply soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Your name *" className={inputClass} />
        <input
          name="email"
          type="email"
          required
          placeholder="Your email *"
          className={inputClass}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="org" placeholder="Organization (optional)" className={inputClass} />
        <select name="eventType" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Event type *
          </option>
          {EVENT_TYPES.map((t) => (
            <option key={t} value={t} className="bg-ink">
              {t}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="date"
          type="date"
          aria-label="Event date"
          className={`${inputClass} [color-scheme:dark]`}
        />
        <select name="budget" defaultValue="" className={inputClass}>
          <option value="" disabled>
            Budget range
          </option>
          {BUDGETS.map((b) => (
            <option key={b} value={b} className="bg-ink">
              {b}
            </option>
          ))}
        </select>
      </div>
      <input name="venue" placeholder="Venue / location" className={inputClass} />
      <textarea
        name="message"
        required
        rows={5}
        placeholder="Tell us about your event *"
        className={inputClass}
      />
      {/* Honeypot — invisible to humans, bots can't resist it */}
      <input
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-gradient-brand rounded-full px-8 py-3 text-sm font-semibold tracking-wide text-ink uppercase transition hover:opacity-90 disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Send inquiry"}
      </button>
      {status === "error" && <p className="text-sm text-clay">{error}</p>}
    </form>
  );
}
