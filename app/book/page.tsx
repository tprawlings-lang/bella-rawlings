import type { Metadata } from "next";
import { site } from "@/content/site";
import { BookingForm } from "@/components/BookingForm";

export const metadata: Metadata = {
  title: "Book a Singer in Dallas–Fort Worth",
  description: `Hire ${site.artistName} for weddings, corporate events, anthems, and private parties across Dallas–Fort Worth. Send a booking inquiry.`,
};

/** FAQ copy — booking-intent keywords for Dallas local search. */
const faqs = [
  {
    q: "Do you perform at private events in Dallas?",
    a: `Yes — ${site.artistName} performs at weddings, corporate events, private parties, and community events across Dallas–Fort Worth. Use the booking form to share your date and details.`,
  },
  {
    q: "Can you sing the national anthem at our game or event?",
    a: "Absolutely. The national anthem is one of her most-requested bookings for games, ceremonies, and corporate gatherings in the DFW area.",
  },
  {
    q: "What does a typical set look like?",
    a: "Acoustic or full-track sets of covers and originals, tailored to your event — from 20-minute features to multi-hour background sets. Mention what you have in mind and we'll suggest a format.",
  },
  {
    q: "How far in advance should we book?",
    a: "Popular dates (spring weddings, December corporate events) go early — 4–8 weeks ahead is ideal, but it never hurts to ask about closer dates.",
  },
];

export default function BookPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <h1 className="fade-up font-display text-4xl font-extrabold sm:text-6xl">
        Book <span className="text-gradient">{site.artistName}</span>
        <br />
        for your event
      </h1>
      <p className="fade-up fade-up-delay-1 mt-4 max-w-2xl text-ink/60">
        Weddings, corporate events, national anthems, private parties, festivals — live music
        across {site.areaServed}. Every inquiry goes straight to Bella&apos;s management.
      </p>

      <div className="fade-up fade-up-delay-2 mt-12">
        <BookingForm />
      </div>

      <section className="mt-20">
        <h2 className="font-display text-3xl font-bold">Common questions</h2>
        <dl className="mt-6 space-y-6">
          {faqs.map((f) => (
            <div key={f.q} className="border-t border-ink/10 pt-5">
              <dt className="font-display text-lg font-bold text-gold">{f.q}</dt>
              <dd className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/65">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
