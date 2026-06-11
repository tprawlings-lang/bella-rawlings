import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-28 text-center">
      <h1 className="font-display text-6xl font-extrabold">
        <span className="text-gradient">404</span>
      </h1>
      <p className="mt-4 text-ink/65">That page wandered off. The music&apos;s this way:</p>
      <Link
        href="/"
        className="bg-gradient-brand mt-8 inline-block rounded-full px-7 py-3 text-sm font-semibold tracking-wide text-cream uppercase transition hover:opacity-90"
      >
        Back home
      </Link>
    </div>
  );
}
