import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SERVICES } from "../../utils/constants";
import SectionHeading from "../common/SectionHeading";
import api from "../../utils/api";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { FloralFlower, FloralStyles } from "../common/FloralDecor";

function ServiceCard({ service, thumb, index }) {
  const [ref, visible] = useScrollReveal();

  return (
    <Link
      ref={ref}
      to={`/gallery?section=${service.gallerySection}`}
      className={`group relative overflow-hidden rounded-xl bg-surface-container-lowest premium-shadow transition-all duration-700 hover:-translate-y-2 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: visible ? `${index * 120}ms` : "0ms" }}
    >
      {/* Floral accent, tucked in the corner */}
      <FloralFlower
        size={22}
        delay={index * 0.3}
        className="absolute top-3 right-3 z-10 text-secondary/50"
      />

      <div className="flex flex-col md:flex-row h-full">
        {/* Thumbnail */}
        <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
          {thumb?.url ? (
            thumb.type === "video" ? (
              <video
                src={thumb.url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            ) : (
              <img
                src={thumb.url}
                alt={service.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            )
          ) : (
            <div className="w-full h-full image-placeholder" />
          )}
        </div>

        <div className="p-8 md:w-1/2 flex flex-col justify-center">
          <h3 className="font-body text-title-lg text-secondary mb-4">
            {service.title}
          </h3>

          <p className="font-body text-body-sm text-on-surface-variant mb-6">
            {service.desc}
          </p>

          <span className="font-body text-label-caps uppercase text-primary border-b border-secondary w-fit pb-1 group-hover:text-secondary group-hover:border-secondary/60 transition-all">
            {service.cta}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ServicesGrid() {
  const [thumbs, setThumbs] = useState({});

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
    <section className="relative py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <SectionHeading
        eyebrow="Curated Experiences"
        title="Bespoke Catering Services"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {SERVICES.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            thumb={thumbs[service.gallerySection]}
            index={index}
          />
        ))}
      </div>

      <FloralStyles />
    </section>
  );
}