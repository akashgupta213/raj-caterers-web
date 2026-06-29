import { useState, useEffect } from "react";
import SectionHeading from "../components/common/SectionHeading";
import TeamCard from "../components/about/TeamCard";
import StatsCounter from "../components/about/StatsCounter";
import api from "../utils/api";

const TEAM = [
  { name: "Raj Kumar Gupta", role: "Founder" },
  { name: "Vishal Kumar",    role: "Co-Founder" },
  { name: "Ritab Lal",       role: "Operation Manager" },
  { name: "Basant Lal",      role: "Executive Chef" },
];

export default function About() {
  const [aboutImages,  setAboutImages]  = useState([]);
  const [heroImage,    setHeroImage]    = useState(null);

  useEffect(() => {
    // fetch about/team images
    api.get("/gallery?section=about")
      .then(res => {
        const result = res.data?.data ?? res.data ?? [];
        setAboutImages(Array.isArray(result) ? result : []);
      })
      .catch(() => {});

    // fetch one hero image for the story section
    api.get("/gallery?section=wedding")
      .then(res => {
        const result = res.data?.data ?? res.data ?? [];
        if (result.length > 0) setHeroImage(result[0].imageUrl);
      })
      .catch(() => {});
  }, []);

  // map team members to images by index (upload in same order as team array)
  const teamWithImages = TEAM.map((member, i) => ({
    ...member,
    imageUrl: aboutImages[i]?.imageUrl || null,
  }));

  return (
    <>
      {/* Story section */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="font-body text-label-caps uppercase tracking-widest text-secondary block mb-4">Our Story</span>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-6">A Legacy of Flavor</h1>
          <p className="font-body text-body-lg text-on-surface-variant mb-4">
            For over two decades, Raj Caterers has been the trusted name behind India's most cherished celebrations — from royal weddings to corporate galas.
          </p>
          <p className="font-body text-body-lg text-on-surface-variant">Our philosophy is simple: every plate tells a story.</p>
        </div>
        <div className="aspect-square rounded-xl overflow-hidden">
          {heroImage
            ? <img src={heroImage} alt="Raj Caterers" className="w-full h-full object-cover" />
            : <div className="w-full h-full image-placeholder" />
          }
        </div>
      </section>

      {/* Stats */}
      <section className="bg-surface-container-low py-section-gap px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto">
          <SectionHeading eyebrow="By the Numbers" title="Excellence in Detail" />
          <StatsCounter stats={[
            { value: "25+", label: "Years" },
            { value: "500+", label: "Events" },
            { value: "50+", label: "Chefs" },
            { value: "98%", label: "Retention" },
          ]} />
        </div>
      </section>

      {/* Team */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <SectionHeading eyebrow="Meet the Team" title="The Visionaries" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
          {teamWithImages.map(m => (
            <TeamCard key={m.name} name={m.name} role={m.role} imageUrl={m.imageUrl} />
          ))}
        </div>
      </section>
    </>
  );
}