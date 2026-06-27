import SectionHeading from "../components/common/SectionHeading";
import ServiceCard from "../components/services/ServiceCard";

const SERVICES = [
  { title: "Weddings", desc: "From intimate ceremonies to grand celebrations.", features: ["Bespoke menu design", "Floral & decor coordination", "Bar & beverage program", "Dedicated event manager"] },
  { title: "Corporate Events", desc: "Sophisticated catering for boardrooms and galas.", features: ["Plated, buffet, and bento", "Executive lunches", "Annual day events", "Branded service ware"] },
  { title: "Private Dining", desc: "An intimate fine-dining experience at home.", features: ["Personal chef", "Custom tasting menus", "Sommelier pairings", "Full service team"] },
  { title: "Social Soirees", desc: "Birthdays, anniversaries, and milestones.", features: ["Themed buffets", "Live counters", "Dessert stations", "Mixology bar"] },
];

export default function Services() {
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <SectionHeading eyebrow="What We Offer" title="Our Catering Services" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {SERVICES.map(s => <ServiceCard key={s.title} {...s} />)}
      </div>
    </section>
  );
}
