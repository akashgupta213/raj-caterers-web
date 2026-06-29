import { useState, useEffect } from "react";
import SectionHeading from "../components/common/SectionHeading";
import ServiceCard from "../components/services/ServiceCard";
import api from "../utils/api";

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

export default function Services() {
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
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <SectionHeading
        eyebrow="What We Offer"
        title="Our Catering Services"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
        {SERVICES.map((service) => (
          <ServiceCard
            key={service.id}
            {...service}
            mediaUrl={thumbs[service.gallerySection]?.url || null}
            mediaType={thumbs[service.gallerySection]?.type || "image"}
          />
        ))}
      </div>
    </section>
  );
}