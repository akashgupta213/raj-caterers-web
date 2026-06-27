import { useState } from "react";
import SectionHeading from "../components/common/SectionHeading";

const FAQS = [
  { q: "How far in advance should I book?", a: "We recommend booking 3–6 months ahead for weddings and 4–6 weeks for corporate events." },
  { q: "Do you customize menus?", a: "Absolutely. Every menu is co-designed with our executive chef based on your theme, dietary needs, and preferences." },
  { q: "What is your service area?", a: "We primarily serve Patna and the surrounding regions." },
  { q: "Do you cater dietary restrictions?", a: "Yes — vegan, gluten-free, Jain, halal, and allergen-aware menus are all available." },
  { q: "What is included in the per-plate price?", a: "Menu execution, service staff, basic tableware, and on-site coordination. Premium tableware and decor are add-ons." },
];

export default function FAQs() {
  const [open, setOpen] = useState(0);
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-3xl mx-auto">
      <SectionHeading eyebrow="Questions Answered" title="Frequently Asked Questions" />
      <div className="space-y-4">
        {FAQS.map((f, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-xl premium-shadow overflow-hidden">
            <button onClick={() => setOpen(open === i ? -1 : i)} className="w-full flex justify-between items-center p-6 text-left">
              <span className="font-display text-title-lg text-primary">{f.q}</span>
              <span className="material-symbols-outlined text-secondary">{open === i ? "remove" : "add"}</span>
            </button>
            {open === i && <p className="px-6 pb-6 font-body text-body-lg text-on-surface-variant">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
