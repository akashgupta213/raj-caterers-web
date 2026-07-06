import { useState, useEffect, useRef } from "react";
import Navbar from "../components/common/Navbar";
import api from "../utils/api";
import { useScrollReveal } from "../hooks/useScrollReveal";

const CATEGORIES = ["Appetizers", "Main Course", "Desserts", "Beverages", "Live Counters"];

const DIETARY_COLORS = {
  "Vegetarian":  "bg-green-100 text-green-700",
  "Vegan":       "bg-emerald-100 text-emerald-700",
  "Halal":       "bg-blue-100 text-blue-700",
  "Gluten Free": "bg-amber-100 text-amber-700",
};

const TAGLINES = [
  "Crafted with Care",
  "Rooted in Tradition",
  "Served with Passion",
];

function RotatingTagline() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex(prev => (prev + 1) % TAGLINES.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p
      className={`font-body text-label-caps uppercase tracking-widest text-secondary mb-2 transition-all duration-400 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
      }`}
    >
      {TAGLINES[index]}
    </p>
  );
}

function TypewriterHeading({ text, start }) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!start) return;
    setTyped("");
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, [start, text]);

  return (
    <h1 className="font-display text-5xl text-primary min-h-[1.2em]">
      {typed}
      <span className="inline-block w-[2px] h-[0.9em] bg-primary align-middle ml-1 animate-pulse" />
    </h1>
  );
}

function CategoryTabs({ category, setCategory, headerVisible }) {
  const containerRef = useRef(null);
  const [pill, setPill] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useEffect(() => {
    const measure = () => {
      const el = containerRef.current?.querySelector(`[data-cat="${category}"]`);
      if (el && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const rect = el.getBoundingClientRect();
        setPill({
          left: rect.left - containerRect.left,
          top: rect.top - containerRect.top,
          width: rect.width,
          height: rect.height,
        });
      }
    };
    measure();
    // tabs can wrap onto a different number of rows as the viewport changes width
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [category, headerVisible]);

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-wrap justify-center gap-2 mb-10 transition-all duration-700 ${
        headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <span
        className="absolute bg-secondary rounded-full transition-all duration-400 ease-out"
        style={{ left: pill.left, top: pill.top, width: pill.width, height: pill.height, zIndex: 0 }}
      />
      {CATEGORIES.map((c, i) => (
        <button
          key={c}
          data-cat={c}
          onClick={() => setCategory(c)}
          style={{ transitionDelay: headerVisible ? `${150 + i * 60}ms` : "0ms" }}
          className={`relative z-10 px-5 py-2 rounded-full border font-body text-[11px] uppercase tracking-wider transition-all duration-500 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          } ${
            category === c
              ? "text-on-primary border-secondary"
              : "border-outline-variant text-on-surface-variant hover:border-secondary"
          }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
}

function MenuCard({ item, index, gridVisible }) {
  const [ref, visible] = useScrollReveal();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const show = visible || gridVisible;

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -5, y: px * 5 });
  };
  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transitionDelay: show ? `${(index % 6) * 80}ms` : "0ms",
        transform: show ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : undefined,
      }}
      className={`bg-surface rounded-xl overflow-hidden border border-outline-variant premium-shadow group transition-all duration-700 will-change-transform hover:shadow-2xl ${
        show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-95"
      }`}
    >
      <div className="relative aspect-video bg-surface-container overflow-hidden">
        {item.imageUrl
          ? <img src={item.imageUrl} alt={item.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
          : <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20">
              <span className="material-symbols-outlined text-[56px]">restaurant</span>
            </div>
        }
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-display text-title-sm text-primary relative inline-block">
            {item.name}
            <span className="absolute left-0 -bottom-0.5 h-[1.5px] bg-secondary w-0 group-hover:w-full transition-all duration-500 ease-out" />
          </h3>
          <span
            style={{ transitionDelay: show ? `${200 + (index % 6) * 80}ms` : "0ms" }}
            className={`font-body text-secondary font-semibold transition-all duration-500 ${
              show ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          >
            ₹{item.price}
          </span>
        </div>
        {item.description && (
          <p className="font-body text-body-sm text-on-surface-variant mb-3">{item.description}</p>
        )}
        <div className="flex flex-wrap gap-1">
          {(item.dietary || []).map((d, di) => (
            <span
              key={d}
              style={{ transitionDelay: show ? `${300 + (index % 6) * 80 + di * 60}ms` : "0ms" }}
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full transition-all duration-400 ${
                show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              } ${DIETARY_COLORS[d] || "bg-surface-container text-on-surface-variant"}`}
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden border border-outline-variant">
          <div className="aspect-video bg-surface-container relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
          <div className="p-5 space-y-3">
            <div className="h-4 w-2/3 bg-surface-container rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
            <div className="h-3 w-full bg-surface-container rounded relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes shimmer { to { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer 1.4s infinite; }
        @media (prefers-reduced-motion: reduce) { .animate-shimmer { animation: none; } }
      `}</style>
    </div>
  );
}

export default function Menu() {
  const [items,    setItems]    = useState([]);
  const [category, setCategory] = useState("Appetizers");
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);
  const [fade,     setFade]     = useState(true);
  const [headerRef, headerVisible] = useScrollReveal();

  useEffect(() => {
    api.get("/menu")
      .then(res => {
        const result = res.data?.data ?? res.data ?? [];
        setItems(Array.isArray(result) ? result : []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFade(false);
    const t = setTimeout(() => setFade(true), 60);
    return () => clearTimeout(t);
  }, [category]);

  const displayed = items.filter(i => i.category === category);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div
        ref={headerRef}
        className={`text-center mb-12 transition-all duration-700 ${
          headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <RotatingTagline />
        <TypewriterHeading text="Our Signature Menu" start={headerVisible} />
      </div>

      <CategoryTabs category={category} setCategory={setCategory} headerVisible={headerVisible} />

      {loading ? (
        <MenuSkeleton />
      ) : error ? (
        <div className="text-center py-20 text-on-surface-variant font-body">
          Menu items will appear here once added from the admin panel.
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20 text-on-surface-variant font-body animate-fade-in">
          No items in {category} yet.
        </div>
      ) : (
        <div
          className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 transition-opacity duration-300 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {displayed.map((item, index) => (
            <MenuCard key={item._id} item={item} index={index} gridVisible={headerVisible} />
          ))}
        </div>
      )}
    </section>
  );
}