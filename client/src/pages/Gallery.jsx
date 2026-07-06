import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";
import { useScrollReveal } from "../hooks/useScrollReveal";

const SECTIONS = [
  { value: "all",            label: "All" },
  { value: "wedding",        label: "Weddings" },
  { value: "engagement",     label: "Engagement" },
  { value: "birthday",       label: "Birthday" },
  { value: "corporate",      label: "Corporate" },
  { value: "private_dining", label: "Private" },
  { value: "social",         label: "Social" },
];

function GalleryImage({ img, onClick }) {
  const [ref, visible] = useScrollReveal();

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`break-inside-avoid rounded-xl overflow-hidden group relative transition-all duration-700 ${
        img.mediaType !== "video" ? "cursor-pointer" : ""
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
    >
      {img.mediaType === "video"
        ? <video
            src={img.imageUrl}
            className="w-full object-cover"
            autoPlay muted loop playsInline
          />
        : <img
            src={img.imageUrl}
            alt={img.caption || ""}
            className="w-full object-cover group-hover:scale-105 transition duration-500"
          />
      }
      {img.caption && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 p-3 opacity-0 group-hover:opacity-100 transition">
          <p className="font-body text-white text-body-sm">{img.caption}</p>
        </div>
      )}
    </div>
  );
}

export default function Gallery() {
  const [searchParams]           = useSearchParams();
  const [images,   setImages]    = useState([]);
  const [filter,   setFilter]    = useState(searchParams.get("section") || "all");
  const [lightbox, setLightbox]  = useState(null);
  const [loading,  setLoading]   = useState(true);
  const [headerRef, headerVisible] = useScrollReveal();

  useEffect(() => {
    api.get("/gallery")
      .then(res => {
        const result = res.data?.data ?? res.data ?? [];
        setImages(Array.isArray(result) ? result : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const s = searchParams.get("section");
    if (s) setFilter(s);
  }, [searchParams]);

  const displayed = filter === "all"
    ? images.filter(i => i.section !== "hero" && i.section !== "about" && i.section !== "about_hero")
    : images.filter(i => i.section === filter);

  return (
    <>
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-700 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <p className="font-body text-label-caps uppercase tracking-widest text-secondary mb-2">Moments to Remember</p>
          <h1 className="font-display text-5xl text-primary">Event Gallery</h1>
        </div>

        {/* Filter tabs */}
        <div
          className={`flex flex-wrap justify-center gap-2 mb-10 transition-all duration-700 delay-150 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {SECTIONS.map((s, i) => (
            <button key={s.value} onClick={() => setFilter(s.value)}
              style={{ transitionDelay: headerVisible ? `${150 + i * 60}ms` : "0ms" }}
              className={`px-5 py-2 rounded-full border font-body text-[11px] uppercase tracking-wider transition-all duration-500 ${
                headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              } ${
                filter === s.value
                  ? "bg-secondary text-on-primary border-secondary"
                  : "border-outline-variant text-on-surface-variant hover:border-secondary"
              }`}>
              {s.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-on-surface-variant">Loading…</div>
        ) : displayed.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant font-body">
            No images in this section yet.
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {displayed.map((img, idx) => (
              <GalleryImage
                key={img._id}
                img={img}
                onClick={() => img.mediaType !== "video" && setLightbox(idx)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Lightbox — images only */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
            onClick={() => setLightbox(null)}>
            <span className="material-symbols-outlined">close</span>
          </button>
          {lightbox > 0 && (
            <button className="absolute left-4 text-white w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
              onClick={e => { e.stopPropagation(); setLightbox(l => l - 1); }}>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
          )}
          <img src={displayed[lightbox]?.imageUrl} alt=""
            className="max-h-[85vh] max-w-[85vw] rounded-xl object-contain"
            onClick={e => e.stopPropagation()} />
          {lightbox < displayed.length - 1 && (
            <button className="absolute right-4 text-white w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition"
              onClick={e => { e.stopPropagation(); setLightbox(l => l + 1); }}>
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          )}
          {displayed[lightbox]?.caption && (
            <p className="absolute bottom-6 text-white/70 font-body text-body-sm">
              {displayed[lightbox].caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}