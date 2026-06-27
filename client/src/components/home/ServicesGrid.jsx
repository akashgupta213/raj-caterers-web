import { Link } from "react-router-dom";
import { SERVICES } from "../../utils/constants";
import SectionHeading from "../common/SectionHeading";

export default function ServicesGrid() {
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <SectionHeading eyebrow="Curated Experiences" title="Bespoke Catering Services" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {SERVICES.map((s) => (
          <div key={s.id} className="group overflow-hidden rounded-xl bg-surface-container-lowest premium-shadow transition duration-500 hover:-translate-y-2">
            <div className="flex flex-col md:flex-row h-full">
              <div className="w-full md:w-1/2 h-64 md:h-auto image-placeholder">text here</div>
              <div className="p-8 md:w-1/2 flex flex-col justify-center">
                <h3 className="font-body text-title-lg text-secondary mb-4">{s.title}</h3>
                <p className="font-body text-body-sm text-on-surface-variant mb-6">{s.desc}</p>
                <Link to="/services" className="font-body text-label-caps uppercase text-primary border-b border-secondary w-fit pb-1 hover:text-secondary">{s.cta}</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
