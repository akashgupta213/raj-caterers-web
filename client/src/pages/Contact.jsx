import SectionHeading from "../components/common/SectionHeading";

const CONTACT_INFO = [
  {
    icon: "location_on",
    title: "Visit Us",
    text: "Gardani Bagh, Tahir Lane, Road no. - 16 Patna, Bihar, 800002",
    href: "https://www.google.com/maps/place/Durgawati+Marriage+Hall/@25.5888162,85.1077897,1496m/data=!3m1!1e3!4m10!1m2!2m1!1sDURGAWATI+!3m6!1s0x39ed598248f81639:0x14c8defa64577f23!8m2!3d25.5905159!4d85.1166326!15sCglEVVJHQVdBVEmSAQ1mZXN0aXZhbF9oYWxs4AEA!16s%2Fg%2F11lktd1g5t?entry=ttu",
  },
  {
    icon: "call",
    title: "Call",
    text: "+91 93341 27247",
    href: "tel:+919334127247",
  },
  {
    icon: "mail",
    title: "Email",
    text: "rajudecorator@gmail.com",
    href: "mailto:rajudecorator@gmail.com",
  },
  {
    icon: "schedule",
    title: "Hours",
    text: "Mon–Sat, 10:00 – 19:00",
    href: null,
  },
];

export default function Contact() {
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <SectionHeading eyebrow="Get in Touch" title="Contact Us Anytime" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: contact info */}
        <div className="space-y-8">
          {CONTACT_INFO.map((b) => (
            <div key={b.title} className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined">{b.icon}</span>
              </div>
              <div>
                <h4 className="font-body text-label-caps uppercase text-secondary mb-1">
                  {b.title}
                </h4>
                {b.href ? (
                  <a
                    href={b.href}
                    target={b.href.startsWith("http") ? "_blank" : undefined}
                    rel={b.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="font-body text-body-lg text-on-surface hover:text-secondary transition-colors duration-200 underline-offset-2 hover:underline"
                  >
                    {b.text}
                  </a>
                ) : (
                  <p className="font-body text-body-lg text-on-surface">{b.text}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Google Maps embed */}
        <div className="rounded-xl overflow-hidden border border-outline-variant/30 shadow-sm relative group">
          <iframe
            title="Raj Caterers Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6512.8818697757915!2d85.10778974691193!3d25.588816188472276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed598248f81639%3A0x14c8defa64577f23!2sDurgawati%20Marriage%20Hall!5e1!3m2!1sen!2sin!4v1782643392318!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />

          {/* Hover button — opens full Google Maps */}
          <a
            href="https://www.google.com/maps/place/Durgawati+Marriage+Hall/@25.5888162,85.1077897,1496m/data=!3m1!1e3!4m10!1m2!2m1!1sDURGAWATI+!3m6!1s0x39ed598248f81639:0x14c8defa64577f23!8m2!3d25.5905159!4d85.1166326!15sCglEVVJHQVdBVEmSAQ1mZXN0aXZhbF9oYWxs4AEA!16s%2Fg%2F11lktd1g5t?entry=ttu"
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 flex items-center gap-2 bg-white text-secondary px-4 py-2 rounded-full font-label-caps text-label-caps shadow-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 border border-outline-variant/30 hover:bg-secondary hover:text-white"
          >
            <span className="material-symbols-outlined text-sm">open_in_new</span>
            Open in Maps
          </a>
        </div>
      </div>
    </section>
  );
}