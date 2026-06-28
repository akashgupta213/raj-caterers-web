import SectionHeading from "../components/common/SectionHeading";
import TeamCard from "../components/about/TeamCard";
import StatsCounter from "../components/about/StatsCounter";

export default function About() {
  return (
    <>
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="font-body text-label-caps uppercase tracking-widest text-secondary block mb-4">Our Story</span>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-6">A Legacy of Flavor</h1>
          <p className="font-body text-body-lg text-on-surface-variant mb-4">For over two decades, Raj Caterers has been the trusted name behind India's most cherished celebrations — from royal weddings to corporate galas.</p>
          <p className="font-body text-body-lg text-on-surface-variant">Our philosophy is simple: every plate tells a story.</p>
        </div>
        <div className="aspect-square rounded-xl image-placeholder">text here</div>
      </section>

      <section className="bg-surface-container-low py-section-gap px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <SectionHeading eyebrow="By the Numbers" title="Excellence in Detail" />
          <StatsCounter stats={[
            { value: "25+", label: "Years" },
            { value: "500+", label: "Events" },
            { value: "50+", label: "Chefs" },
            { value: "98%", label: "Retention" },
          ]} />
        </div>
      </section>

      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <SectionHeading eyebrow="Meet the Team" title="The Visionaries" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
          {[
            { name: "Raj Kumar Gupta", role: "Founder" },
            { name: "Vishal Kumar", role: "Co-Founder" },
            { name: "Aditya Roy", role: "Events Director" },
            { name: "Sneha Iyer", role: "Hospitality Lead" },
          ].map(m => <TeamCard key={m.name} {...m} />)}
        </div>
      </section>
    </>
  );
}
