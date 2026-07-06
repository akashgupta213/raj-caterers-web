import { useState, useEffect } from "react";
import SectionHeading from "../components/common/SectionHeading";
import ServiceCard from "../components/services/ServiceCard";
import api from "../utils/api";
import { useScrollReveal } from "../hooks/useScrollReveal";

const SERVICES = [
  {
    id: "weddings",
    title: "Weddings",
    gallerySection: "wedding",
    desc: "From intimate ceremonies to grand celebrations.",
    features: [
      "Bespoke menu design",
      "Floral & decor coordination",
      "Bar & beverage program",
      "Dedicated event manager",
    ],
  },
  {
    id: "corporate",
    title: "Corporate Events",
    gallerySection: "corporate",
    desc: "Sophisticated catering for boardrooms and galas.",
    features: [
      "Plated, buffet, and bento",
      "Executive lunches",
      "Annual day events",
      "Branded service ware",
    ],
  },
  {
    id: "private",
    title: "Private Dining",
    gallerySection: "private_dining",
    desc: "An intimate fine-dining experience at home.",
    features: [
      "Personal chef",
      "Custom tasting menus",
      "Sommelier pairings",
      "Full service team",
    ],
  },
  {
    id: "social",
    title: "Social Soirees",
    gallerySection: "social",
    desc: "Birthdays, anniversaries, and milestones.",
    features: [
      "Themed buffets",
      "Live counters",
      "Dessert stations",
      "Mixology bar",
    ],
  },
];

function AnimatedServiceCard({ service, mediaUrl, mediaType, index }) {
  const [ref, visible] = useScrollReveal();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 6 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transitionDelay: visible ? `${index * 130}ms` : "0ms",
        transform: visible
          ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
          : undefined,
      }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-16 scale-95"
      }`}
    >
      <ServiceCardAnimated
        {...service}
        mediaUrl={mediaUrl}
        mediaType={mediaType}
        active={visible}
      />
    </div>
  );
}

function ServiceCardAnimated({ title, desc, features, mediaUrl, mediaType, active }) {
  return (
    <div className="group relative bg-surface rounded-2xl overflow-hidden border border-outline-variant premium-shadow transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      <div className="relative aspect-video overflow-hidden bg-surface-container">
        {mediaUrl ? (
          mediaType === "video" ? (
            <video
              src={mediaUrl}
              autoPlay muted loop playsInline
              className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          ) : (
            <img
              src={mediaUrl}
              alt={title}
              className="w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20">
            <span className="material-symbols-outlined text-[56px]">restaurant_menu</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="p-6">
        <h3 className="font-display text-title-lg text-primary mb-2 relative inline-block">
          {title}
          <span className="absolute left-0 -bottom-1 h-[2px] bg-secondary w-0 group-hover:w-full transition-all duration-500 ease-out" />
        </h3>
        <p className="font-body text-body-sm text-on-surface-variant mb-5">{desc}</p>

        <ul className="space-y-2">
          {features.map((f, i) => (
            <li
              key={f}
              style={{ transitionDelay: active ? `${300 + i * 90}ms` : "0ms" }}
              className={`flex items-center gap-2 font-body text-body-sm text-on-surface transition-all duration-500 ${
                active ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
              }`}
            >
              <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 group-hover:scale-125 transition-transform duration-300">
                check_circle
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Services() {
  const [thumbs, setThumbs] = useState({});
  const [headerRef, headerVisible] = useScrollReveal();

  useEffect(() => {
    Promise.all(
      SERVICES.map((service) =>
        api
          .get(`/gallery?section=${service.gallerySection}`)
          .then((res) => {
            const result = res.data?.data ?? res.data ?? [];

            const first =
              Array.isArray(result) && result.length > 0
                ? result[0]
                : null;

            return {
              section: service.gallerySection,
              mediaUrl: first?.imageUrl ?? null,
              mediaType: first?.mediaType ?? "image",
            };
          })
          .catch(() => ({
            section: service.gallerySection,
            mediaUrl: null,
            mediaType: "image",
          }))
      )
    ).then((results) => {
      const map = {};

      results.forEach((item) => {
        map[item.section] = {
          url: item.mediaUrl,
          type: item.mediaType,
        };
      });

      setThumbs(map);
    });
  }, []);

  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div
        ref={headerRef}
        className={`transition-all duration-700 ${
          headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <SectionHeading
          eyebrow="What We Offer"
          title="Our Catering Services"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {SERVICES.map((service, index) => (
          <AnimatedServiceCard
            key={service.id}
            service={service}
            mediaUrl={thumbs[service.gallerySection]?.url || null}
            mediaType={thumbs[service.gallerySection]?.type || "image"}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}