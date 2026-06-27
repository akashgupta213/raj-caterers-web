import SectionHeading from "../components/common/SectionHeading";

export default function Contact() {
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <SectionHeading eyebrow="Get in Touch" title="Contact Us" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          {[
            { icon: "location_on", title: "Visit Us", text: "Gardani Bagh, Tahir Lane, Road no. - 16 Patna, Bihar, 800002" },
            { icon: "call", title: "Call", text: "+91 93341 27247" },
            { icon: "mail", title: "Email", text: "hello@rajcaterers.com" },
            { icon: "schedule", title: "Hours", text: "Mon–Sat, 10:00 – 19:00" },
          ].map(b => (
            <div key={b.title} className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary"><span className="material-symbols-outlined">{b.icon}</span></div>
              <div>
                <h4 className="font-body text-label-caps uppercase text-secondary mb-1">{b.title}</h4>
                <p className="font-body text-body-lg text-on-surface">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="aspect-square rounded-xl image-placeholder">text here</div>
      </div>
    </section>
  );
}
