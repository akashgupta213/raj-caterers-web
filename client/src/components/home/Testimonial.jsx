export default function Testimonial() {
  return (
    <section className="bg-surface-container-low py-section-gap overflow-hidden relative">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center relative z-10">
        <span className="material-symbols-outlined text-secondary text-5xl mb-8" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
        <h3 className="font-display text-headline-md-mobile md:text-headline-md text-primary italic mb-10 leading-relaxed max-w-3xl mx-auto">
          "Raj Caterers turned our dream wedding into a culinary masterpiece. The attention to detail and the exquisite flavors left our guests talking for months."
        </h3>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-white shadow-md image-placeholder">text</div>
          <p className="font-body text-label-caps uppercase text-secondary">The Henderson Family</p>
          <p className="font-body text-body-sm text-on-surface-variant">Annual Gala Hosts</p>
        </div>
      </div>
    </section>
  );
}
