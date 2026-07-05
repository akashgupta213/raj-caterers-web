import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const formatCapacity = (min, max) => {
  if (!min && !max) return "Flexible capacity";
  if (!min) return `Up to ${max} Pax`;
  if (min === max) return `${min} Pax`;
  return `${min} - ${max} Pax`;
};

const WEDDING_QUOTES = [
  { text: "A great marriage is not when the perfect couple comes together. It is when an imperfect couple learns to enjoy their differences.", author: "Dave Meurer" },
  { text: "Love is composed of a single soul inhabiting two bodies.", author: "Aristotle" },
  { text: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
  { text: "Every love story is beautiful, but ours is my favorite.", author: "Unknown" },
  { text: "To love and be loved is to feel the sun from both sides.", author: "David Viscott" },
];

function ScrollHint({ targetId }) {
  const scrollToCollection = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <button
      onClick={scrollToCollection}
      className="hidden md:flex items-center gap-3 mt-14 text-on-surface-variant group"
    >
      <span
        className="font-body text-[10px] uppercase tracking-[0.3em] group-hover:text-secondary transition-colors"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        Scroll Down
      </span>
      <span className="w-6 h-10 rounded-full border-2 border-on-surface-variant/40 group-hover:border-secondary flex justify-center pt-2 transition-colors">
        <span className="w-1 h-1 rounded-full bg-secondary scroll-dot" />
      </span>
    </button>
  );
}

function HeroTagline() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % WEDDING_QUOTES.length);
        setVisible(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const quote = WEDDING_QUOTES[index];

  return (
    <div className="relative pl-5 mb-8 min-h-[64px] max-w-md">
      <div className="absolute left-0 top-1 bottom-1 w-px bg-secondary/50" />
      <p
        className={`font-display italic text-body-sm md:text-body-md text-on-surface-variant leading-relaxed transition-all duration-500 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
        }`}
      >
        “{quote.text}”
      </p>
    </div>
  );
}

function HeroPhotoComposition({ images }) {
  const stillImages = images.filter((i) => i.mediaType !== "video");
  const mainPool = stillImages.length ? stillImages : [];
  const [mainIdx, setMainIdx] = useState(0);
  const [floatIdx, setFloatIdx] = useState(1 % Math.max(mainPool.length, 1));

  useEffect(() => {
    if (mainPool.length < 2) return;
    const t = setInterval(() => {
      setMainIdx((i) => (i + 1) % mainPool.length);
    }, 6000);
    return () => clearInterval(t);
  }, [mainPool.length]);

  useEffect(() => {
    if (mainPool.length < 3) return;
    const t = setInterval(() => {
      setFloatIdx((i) => (i + 1) % mainPool.length);
    }, 7000);
    return () => clearInterval(t);
  }, [mainPool.length]);

  const mainImg = mainPool[mainIdx];
  const floatImg = mainPool.length > 1 ? mainPool[floatIdx === mainIdx ? (floatIdx + 1) % mainPool.length : floatIdx] : null;

  return (
    <div className="relative w-[260px] sm:w-[320px] md:w-[380px] lg:w-[420px] mx-auto" style={{ aspectRatio: "0.82" }}>
      {/* Orbiting curved text badge */}
      <svg
        className="absolute -top-5 -right-5 md:-top-7 md:-right-7 w-24 h-24 md:w-28 md:h-28 text-secondary spin-slow"
        viewBox="0 0 120 120"
      >
        <defs>
          <path id="heroCirclePath" d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" fill="none" />
        </defs>
        <text fontSize="8.5" letterSpacing="2.5" fill="currentColor" className="uppercase font-body">
          <textPath href="#heroCirclePath" startOffset="0%">
            • BANQUET HALLS • WEDDING VENUES
          </textPath>
        </text>
      </svg>

      {/* Main arch photo */}
      <div className="absolute inset-0 rounded-t-full rounded-b-[2.5rem] border-[6px] border-secondary/25 overflow-hidden shadow-xl bg-surface-container-high">
        {mainImg ? (
          <img
            key={mainImg._id}
            src={mainImg.imageUrl}
            alt={mainImg.caption || "Wedding celebration"}
            className="w-full h-full object-cover fade-in-image"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant/50">
            <span className="material-symbols-outlined text-[48px]">image</span>
          </div>
        )}
      </div>

      {/* Dashed connector */}
      <svg
        className="absolute left-[-6%] bottom-[10%] w-[45%] h-[30%] text-secondary/50 pointer-events-none"
        viewBox="0 0 100 70"
        fill="none"
      >
        <path d="M95,5 Q40,10 15,55" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 5" />
      </svg>

      {/* Floating circular photo */}
      <div className="floating-card absolute left-[-10%] bottom-[6%] w-[34%] aspect-square rounded-full border-4 border-white shadow-lg overflow-hidden bg-surface-container-high">
        {floatImg ? (
          <img
            key={floatImg._id}
            src={floatImg.imageUrl}
            alt={floatImg.caption || "Wedding detail"}
            className="w-full h-full object-cover fade-in-image"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-on-surface-variant/40">
            <span className="material-symbols-outlined text-[20px]">image</span>
          </div>
        )}
      </div>

      {/* Decorative flower */}
      <span className="absolute -bottom-3 right-3 text-2xl opacity-80 select-none" aria-hidden="true">🌸</span>

      <style>{`
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-slow { animation: spinSlow 26s linear infinite; transform-origin: 50% 50%; }

        @keyframes cardFloat {
          0%, 100% { translate: 0 0; }
          50% { translate: 0 -10px; }
        }
        .floating-card { animation: cardFloat 5s ease-in-out infinite; }

        @keyframes fadeInImage {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fade-in-image { animation: fadeInImage 0.8s ease-out; }

        @keyframes dotBounce {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(10px); opacity: 0.3; }
        }
        .scroll-dot { animation: dotBounce 1.6s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .spin-slow, .floating-card, .fade-in-image, .scroll-dot { animation: none; }
        }
      `}</style>
    </div>
  );
}

export default function BanquetHalls() {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroImages, setHeroImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/banquet-halls");
        setHalls(res.data.data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, []);

  // Pull hero photos uploaded via the admin Gallery manager (section: "hero")
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/gallery/all");
        const heroOnly = (res.data.data || [])
          .filter((img) => img.section === "banquet_hero" && img.isActive !== false)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setHeroImages(heroOnly);
      } catch (e) { console.error(e); }
    })();
  }, []);

  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="relative w-full py-16 md:py-20 px-margin-mobile md:px-margin-desktop overflow-hidden bg-surface-container-lowest">
        <span className="absolute top-8 left-6 md:left-10 text-3xl opacity-70 select-none" aria-hidden="true">🌸</span>

        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
              <h1 className="font-display text-headline-md md:text-display-lg text-primary leading-tight">
                Let&rsquo;s Curate Your
              </h1>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <h1 className="font-display text-headline-md md:text-display-lg text-secondary leading-tight">
                Dream Wedding
              </h1>
              <span className="material-symbols-outlined text-secondary text-[32px] md:text-[38px] heart-pulse">
                favorite
              </span>
            </div>

            <div className="flex justify-center lg:justify-start">
              <HeroTagline />
            </div>

            <p className="font-body text-body-sm md:text-body-md text-on-surface-variant max-w-md mx-auto lg:mx-0 mb-8 leading-relaxed">
              From grand banquet halls to bespoke décor, we help you plan and celebrate every
              moment of your big day — beautifully, effortlessly, unforgettably.
            </p>

            <button
              onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-secondary text-on-primary px-8 py-4 rounded-full font-body text-[11px] uppercase tracking-wider hover:opacity-90 transition"
            >
              Explore Venues
            </button>

            <div className="hidden lg:block">
              <ScrollHint targetId="collection" />
            </div>
          </div>

          {/* Right */}
          <div className="order-1 lg:order-2">
            <HeroPhotoComposition images={heroImages} />
          </div>
        </div>

        <style>{`
          @keyframes heartPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
          }
          .heart-pulse { display: inline-block; animation: heartPulse 1.8s ease-in-out infinite; }
          @media (prefers-reduced-motion: reduce) {
            .heart-pulse { animation: none; }
          }
        `}</style>
      </section>

      {/* Halls grid */}
      <section id="collection" className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-display text-headline-md text-primary mb-4">The Collection</h2>
          <div className="w-20 h-px bg-secondary mx-auto" />
        </div>

        {loading ? (
          <p className="font-body text-body-sm text-on-surface-variant text-center">Loading venues…</p>
        ) : halls.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant font-body text-body-sm border-2 border-dashed border-outline-variant rounded-xl">
            Venues coming soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {halls.map((hall) => (
              <div
                key={hall._id}
                onClick={() => navigate(`/banquet-halls/${hall._id}`)}
                className="cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm flex flex-col transition-transform duration-400 hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="relative h-56 md:h-72 overflow-hidden">
                  {hall.images?.[0]?.url ? (
                    <img src={hall.images[0].url} alt={hall.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-[40px]">image</span>
                    </div>
                  )}
                  {hall.featured && (
                    <div className="absolute top-4 left-4 bg-secondary text-on-secondary px-4 py-1 rounded-full font-body text-[10px] uppercase tracking-wider">
                      Premium
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-md text-white px-3 py-1 rounded-full flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">groups</span>
                    <span className="font-body text-[10px] uppercase tracking-wider">
                      {formatCapacity(hall.capacityMin, hall.capacityMax)}
                    </span>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex-grow flex flex-col">
                  <h3 className="font-body text-title-lg text-on-surface mb-3">{hall.name}</h3>
                  {hall.amenities?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {hall.amenities.slice(0, 3).map((a) => (
                        <span
                          key={a}
                          className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-body text-[10px] uppercase tracking-wider"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/banquet-halls/${hall._id}`); }}
                    className="mt-auto w-full border border-secondary text-secondary font-body text-[11px] uppercase tracking-wider py-4 rounded hover:bg-secondary hover:text-white transition-all"
                  >
                    View Availability &amp; Photos
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}