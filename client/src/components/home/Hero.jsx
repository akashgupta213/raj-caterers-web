import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { FloralFlower, FloralSprig, FloralStyles } from "../common/FloralDecor";

export default function Hero() {
  const [slides,  setSlides]  = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    api.get("/gallery?section=hero")
      .then(res => {
        const result = res.data?.data ?? res.data ?? [];
        setSlides(Array.isArray(result) ? result : []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">

      {/* Background slides or fallback */}
      {slides.length > 0
        ? slides.map((slide, i) => (
            <div key={slide._id}
              className={`absolute inset-0 z-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}
            >
              {slide.mediaType === "video"
                ? <video
                    src={slide.imageUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                  />
                : <img
                    src={slide.imageUrl}
                    alt={slide.caption || ""}
                    className="w-full h-full object-cover hero-kenburns"
                  />
              }
            </div>
          ))
        : <div className="absolute inset-0 z-0 image-placeholder" />
      }

      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay z-0" />

      {/* Decorative florals — hidden on small screens so they don't crowd the text */}
      <div className="hidden md:block absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 z-[1] text-white/40">
        <FloralSprig size={44} delay={0} />
        <div className="mt-4 ml-8"><FloralSprig size={34} delay={1.2} flip /></div>
      </div>
      <div className="hidden md:block absolute right-6 lg:right-10 top-1/3 z-[1] text-white/40">
        <FloralFlower size={38} delay={0.4} />
        <div className="mt-6 mr-2"><FloralSprig size={30} delay={1.6} /></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-margin-mobile">
        <span className="font-body text-label-caps text-white tracking-[0.3em] mb-6 animate-fade-in inline-flex items-center gap-3">
          <FloralFlower size={16} className="text-gold" />
          PREMIUM HOSPITALITY
          <FloralFlower size={16} delay={0.5} className="text-gold" />
        </span>
        <h1 className="font-display text-display-lg-mobile md:text-display-lg text-white mb-8 leading-tight animate-fade-in">
          Excellence in Every Bite
        </h1>
        <p className="font-body text-body-lg text-white/90 mb-10 max-w-2xl mx-auto animate-fade-in-delay">
          Crafting unforgettable culinary journeys for life's most precious moments with bespoke menus and impeccable service.
        </p>
        <div className="flex flex-col md:flex-row gap-gutter justify-center items-center animate-fade-in-delay">
          <Link to="/enquire" className="bg-gold text-on-background px-10 py-4 rounded-full font-body text-label-caps uppercase shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
            Book Now
          </Link>
          <Link to="/services" className="border border-white/50 text-white backdrop-blur-md px-10 py-4 rounded-full font-body text-label-caps uppercase hover:bg-white/10 transition">
            View Services
          </Link>
        </div>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-white w-6" : "bg-white/50 w-2"}`} />
          ))}
        </div>
      )}

      {/* Wave cut at bottom, overlapping the hero image */}
      <div className="absolute bottom-0 left-0 w-full z-[2] leading-[0]">
        <svg
          className="w-full h-[80px] md:h-[120px]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60 C240,110 480,10 720,60 C960,110 1200,10 1440,60 L1440,120 L0,120 Z"
            fill="#FDF8F5"
          />
        </svg>
      </div>

      <FloralStyles />
      <style>{`
        @keyframes heroKenburns {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        .hero-kenburns { animation: heroKenburns 14s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hero-kenburns { animation: none; }
        }
      `}</style>
    </section>
  );
}