import Link from "next/link";

/** Landing page after the double opt-in confirmation link. */
export default async function SubscribedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const copy =
    status === "ok"
      ? {
          title: "You're in! ♡",
          body: "Your email is confirmed. New songs, shows, and the occasional secret — straight to your inbox.",
        }
      : status === "expired"
        ? {
            title: "That link expired",
            body: "Confirmation links only last 24 hours. Sign up again below and tap the new link right away.",
          }
        : {
            title: "Something went wrong",
            body: "We couldn't confirm your email just now. Please try signing up again in a bit.",
          };

  return (
    <div className="mx-auto max-w-2xl px-5 py-28 text-center">
      <h1 className="font-display text-5xl font-extrabold">
        <span className="text-gradient">{copy.title}</span>
      </h1>
      <p className="mt-5 text-ink/65">{copy.body}</p>
      <Link
        href="/"
        className="bg-gradient-brand mt-8 inline-block rounded-full px-7 py-3 text-sm font-semibold tracking-wide text-cream uppercase transition hover:opacity-90"
      >
        Back to the music
      </Link>
    </div>
  );
}
