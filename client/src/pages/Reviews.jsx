import SectionHeading from "../components/common/SectionHeading";
import ReviewCard from "../components/reviews/ReviewCard";

const REVIEWS = [
  { name: "Aanya & Rohan", event: "Wedding • Mumbai", rating: 5, text: "The food was the centerpiece of our wedding. Guests still rave about the lamb shank." },
  { name: "Tata Consultancy", event: "Annual Gala", rating: 5, text: "Flawless execution for 600 guests. Our leadership was thoroughly impressed." },
  { name: "The Mehras", event: "60th Anniversary", rating: 5, text: "Bespoke menu honoring family recipes — a deeply personal touch." },
  { name: "Studio Maven", event: "Brand Launch", rating: 5, text: "Edgy menu styled to match our brand. Absolutely on-point." },
];

export default function Reviews() {
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <SectionHeading eyebrow="Kind Words" title="Client Reviews" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {REVIEWS.map(r => <ReviewCard key={r.name} {...r} />)}
      </div>
    </section>
  );
}
