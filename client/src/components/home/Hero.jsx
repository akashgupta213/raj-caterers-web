import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";

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
                    className="w-full h-full object-cover"
                  />
              }
            </div>
          ))
        : <div className="absolute inset-0 z-0 image-placeholder" />
      }

      {/* Overlay */}
      <div className="absolute inset-0 hero-overlay z-0" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl px-margin-mobile">
        <span className="font-body text-label-caps text-white tracking-[0.3em] block mb-6 animate-fade-in">
          PREMIUM HOSPITALITY
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
    </section>
  );
}