import { Link } from "react-router-dom";
export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 image-placeholder">text here</div>
      <div className="absolute inset-0 hero-overlay z-0" />
      <div className="relative z-10 text-center max-w-4xl px-margin-mobile">
        <span className="font-body text-label-caps text-white tracking-[0.3em] block mb-6 animate-fade-in">PREMIUM HOSPITALITY</span>
        <h1 className="font-display text-display-lg-mobile md:text-display-lg text-white mb-8 leading-tight animate-fade-in">Excellence in Every Bite</h1>
        <p className="font-body text-body-lg text-white/90 mb-10 max-w-2xl mx-auto animate-fade-in-delay">Crafting unforgettable culinary journeys for life's most precious moments with bespoke menus and impeccable service.</p>
        <div className="flex flex-col md:flex-row gap-gutter justify-center items-center animate-fade-in-delay">
          <Link to="/enquire" className="bg-gold text-on-background px-10 py-4 rounded-full font-body text-label-caps uppercase shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">Book Now</Link>
          <Link to="/services" className="border border-white/50 text-white backdrop-blur-md px-10 py-4 rounded-full font-body text-label-caps uppercase hover:bg-white/10 transition">View Services</Link>
        </div>
      </div>
    </section>
  );
}
