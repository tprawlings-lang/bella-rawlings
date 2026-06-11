"use client";

import { useMemo, useState } from "react";

export type ShowView = {
  title: string;
  dateTime: string; // "2026-07-18 19:30"
  venueName: string;
  city: string;
  ticketUrl: string;
  eventType: string;
  soldOut?: boolean;
  googleUrl: string;
  icsUrl: string;
};

function toDate(s: string): Date {
  return new Date(s.replace(" ", "T") + ":00");
}

function ShowRow({ show }: { show: ShowView }) {
  const d = toDate(show.dateTime);
  return (
    <li className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-6">
        <div className="w-16 shrink-0 text-center">
          <p className="text-xs tracking-widest text-clay uppercase">
            {d.toLocaleDateString("en-US", { month: "short" })}
          </p>
          <p className="font-display text-3xl font-bold">{d.getDate()}</p>
          <p className="text-[11px] text-ink/40">{d.getFullYear()}</p>
        </div>
        <div>
          <p className="font-display text-xl font-bold">{show.title}</p>
          <p className="text-sm text-ink/60">
            {show.venueName} · {show.city} ·{" "}
            {d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
          </p>
          <p className="mt-1 text-[11px] tracking-widest text-ink/40 uppercase">
            {show.eventType}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:justify-end">
        <a
          href={show.googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs tracking-widest text-ink/50 uppercase transition hover:text-gold"
        >
          + Google Cal
        </a>
        <a
          href={show.icsUrl}
          className="text-xs tracking-widest text-ink/50 uppercase transition hover:text-gold"
        >
          + iCal
        </a>
        {show.soldOut ? (
          <span className="text-sm font-semibold tracking-widest text-ink/40 uppercase">
            Sold out
          </span>
        ) : show.ticketUrl ? (
          <a
            href={show.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-brand rounded-full px-6 py-2.5 text-sm font-semibold tracking-wide text-cream uppercase transition hover:opacity-90"
          >
            Tickets
          </a>
        ) : (
          <span className="text-sm font-semibold tracking-widest text-gold uppercase">
            On sale soon
          </span>
        )}
      </div>
    </li>
  );
}

function MonthGrid({ shows }: { shows: ShowView[] }) {
  const [offset, setOffset] = useState(0);
  const base = new Date();
  const month = new Date(base.getFullYear(), base.getMonth() + offset, 1);

  const byDay = useMemo(() => {
    const map = new Map<number, ShowView[]>();
    for (const s of shows) {
      const d = toDate(s.dateTime);
      if (d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth()) {
        map.set(d.getDate(), [...(map.get(d.getDate()) ?? []), s]);
      }
    }
    return map;
  }, [shows, month]);

  const firstWeekday = month.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => setOffset(offset - 1)}
          className="rounded-full border border-ink/20 px-4 py-1.5 text-sm transition hover:border-clay hover:text-clay"
          aria-label="Previous month"
        >
          ←
        </button>
        <p className="font-display text-xl font-bold">
          {month.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
        <button
          onClick={() => setOffset(offset + 1)}
          className="rounded-full border border-ink/20 px-4 py-1.5 text-sm transition hover:border-clay hover:text-clay"
          aria-label="Next month"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-ink/10 bg-ink/10">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="bg-cream p-2 text-center text-xs text-ink/40">
            {d}
          </div>
        ))}
        {cells.map((day, i) => (
          <div key={i} className="min-h-20 bg-cream p-1.5">
            {day && (
              <>
                <p className="text-xs text-ink/40">{day}</p>
                {(byDay.get(day) ?? []).map((s) => (
                  <a
                    key={s.dateTime + s.venueName}
                    href={s.ticketUrl || undefined}
                    target={s.ticketUrl ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="bg-gradient-brand mt-1 block truncate rounded px-1.5 py-1 text-[10px] leading-tight font-semibold text-cream"
                    title={`${s.title} — ${s.venueName}`}
                  >
                    {s.venueName}
                  </a>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ShowsView({
  upcoming,
  past,
  masterIcsUrl,
}: {
  upcoming: ShowView[];
  past: ShowView[];
  masterIcsUrl: string;
}) {
  const [view, setView] = useState<"list" | "calendar">("list");

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-1 rounded-full border border-ink/15 p-1">
          {(["list", "calendar"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-5 py-1.5 text-sm capitalize transition ${
                view === v ? "bg-ink/10 text-ink" : "text-ink/50 hover:text-ink"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <a
          href={masterIcsUrl}
          className="text-xs tracking-widest text-ink/50 uppercase transition hover:text-gold"
        >
          Subscribe to all shows (.ics)
        </a>
      </div>

      <div className="mt-8">
        {view === "list" ? (
          upcoming.length > 0 ? (
            <ul className="divide-y divide-ink/10 border-y border-ink/10">
              {upcoming.map((s) => (
                <ShowRow key={s.dateTime + s.venueName} show={s} />
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-ink/20 px-6 py-16 text-center">
              <p className="font-display text-2xl font-bold">No shows announced… yet.</p>
              <p className="mt-2 text-sm text-ink/60">
                Join the list at the bottom of the page and you&apos;ll be the first to know.
              </p>
            </div>
          )
        ) : (
          <MonthGrid shows={upcoming} />
        )}
      </div>

      {past.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold text-ink/70">Past shows</h2>
          <ul className="mt-4 space-y-2">
            {past.map((s) => {
              const d = toDate(s.dateTime);
              return (
                <li key={s.dateTime + s.venueName} className="text-sm text-ink/50">
                  {d.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  — {s.title}, {s.venueName}, {s.city}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
