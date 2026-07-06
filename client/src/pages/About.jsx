import { useState, useEffect } from "react";
import SectionHeading from "../components/common/SectionHeading";
import TeamCard from "../components/about/TeamCard";
import StatsCounter from "../components/about/StatsCounter";
import api from "../utils/api";
import { useScrollReveal } from "../hooks/useScrollReveal";


// used only if the /team endpoint isn't available yet, so the section never renders empty
const FALLBACK_TEAM = [
  { name: "Raj Kumar Gupta", role: "Founder" },
  { name: "Vishal Kumar",    role: "Co-Founder" },
  { name: "Ritab Lal",       role: "Operation Manager" },
  { name: "Basant Lal",      role: "Executive Chef" },
];

const STATS = [
  { value: "25+", label: "Years" },
  { value: "500+", label: "Events" },
  { value: "50+", label: "Chefs" },
  { value: "98%", label: "Retention" },
];

function AnimatedTeamCard({ member, index }) {
  const [ref, visible] = useScrollReveal();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: visible ? `${index * 120}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
      }`}
    >
      <TeamCard
        name={member.name}
        role={member.role}
        mediaUrl={member.mediaUrl}
        mediaType={member.mediaType}
      />
    </div>
  );
}

export default function About() {
  const [aboutImages, setAboutImages] = useState([]);
  const [heroMedia,   setHeroMedia]   = useState(null); // { url, type }
  const [team,        setTeam]        = useState(FALLBACK_TEAM);

  const [statsRef, statsVisible] = useScrollReveal();
  const [teamHeaderRef, teamHeaderVisible] = useScrollReveal();

  // NEW: refs for the story section's text (slides in from left)
  // and hero media (slides in from right, opposite direction)
  const [storyTextRef, storyTextVisible] = useScrollReveal();
  const [heroMediaRef, heroMediaVisible] = useScrollReveal();

  useEffect(() => {
    // fetch about/team images
    api.get("/gallery?section=about")
      .then(res => {
        const result = res.data?.data ?? res.data ?? [];
        setAboutImages(Array.isArray(result) ? result : []);
      })
      .catch(() => {});

    // fetch hero video/image for the story section
    api.get("/gallery?section=about_hero")
      .then(res => {
        const result = res.data?.data ?? res.data ?? [];
        if (result.length > 0)
          setHeroMedia({ url: result[0].imageUrl, type: result[0].mediaType });
      })
      .catch(() => {});

    // fetch team members from the backend instead of using a hardcoded list
    api.get("/team")
      .then(res => {
        const result = res.data?.data ?? res.data ?? [];
        if (Array.isArray(result) && result.length > 0) {
          setTeam(result.map(member => ({
            name: member.name,
            role: member.role,
            mediaUrl: member.imageUrl || null,
            mediaType: member.mediaType || "image",
          })));
        }
      })
      .catch(() => {
        // /team not available yet — keep FALLBACK_TEAM, matched with about-section images by index
      });
  }, []);

  // if the dynamic /team fetch failed, still try to pair fallback names with any uploaded about-images
  const teamWithImages = team === FALLBACK_TEAM
    ? team.map((member, i) => ({
        ...member,
        mediaUrl: aboutImages[i]?.imageUrl || null,
        mediaType: aboutImages[i]?.mediaType || "image",
      }))
    : team;

  return (
    <>
      {/* Story section */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div
          ref={storyTextRef}
          className={`transition-all duration-700 ease-out ${
            storyTextVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`}
        >
          <span className="font-body text-label-caps uppercase tracking-widest text-secondary block mb-4">Our Story</span>
          <h1 className="font-display text-display-lg-mobile md:text-display-lg text-primary mb-6">A Legacy of Flavor</h1>
          <p className="font-body text-body-lg text-on-surface-variant mb-4">
            For over two decades, Raj Caterers has been the trusted name behind India's most cherished celebrations — from royal weddings to corporate galas.
          </p>
          <p className="font-body text-body-lg text-on-surface-variant">Our philosophy is simple: every plate tells a story.</p>
        </div>

        <div
          ref={heroMediaRef}
          className={`aspect-square rounded-xl overflow-hidden transition-all duration-700 ease-out ${
            heroMediaVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-16"
          }`}
        >
          {heroMedia?.type === "video" ? (
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              src={heroMedia.url}
            />
          ) : heroMedia?.url ? (
            <img src={heroMedia.url} alt="Raj Caterers" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full image-placeholder" />
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-surface-container-low py-section-gap px-margin-mobile md:px-margin-desktop">
        <div
          ref={statsRef}
          className={`max-w-container-max mx-auto transition-all duration-700 ease-out ${
            statsVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
          }`}
        >
          <SectionHeading eyebrow="By the Numbers" title="Excellence in Detail" />
          <StatsCounter
            animate={statsVisible}
            stats={[
              { value: "25+", label: "Years" },
              { value: "500+", label: "Events" },
              { value: "50+", label: "Chefs" },
              { value: "98%", label: "Retention" },
            ]}
          />
        </div>
      </section>

      {/* Team */}
      <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div
          ref={teamHeaderRef}
          className={`transition-all duration-700 ease-out ${
            teamHeaderVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <SectionHeading eyebrow="Meet the Team" title="The Visionaries" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
          {teamWithImages.map((member, index) => (
            <AnimatedTeamCard key={member.name ?? index} member={member} index={index} />
          ))}
        </div>
      </section>
    </>
  );
}