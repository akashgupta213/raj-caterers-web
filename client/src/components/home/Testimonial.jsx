import { useScrollReveal } from "../../hooks/useScrollReveal";
import { FloralFlower, FloralStyles } from "../common/FloralDecor";

export default function Testimonial() {
  const [ref, visible] = useScrollReveal();

  return (
    <section ref={ref} className="bg-surface-container-low py-section-gap overflow-hidden relative">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">

        <div
          className={`relative max-w-2xl mx-auto text-center transition-all duration-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Layered hexagon frame, echoing the testimonial reference */}
          <svg
            className="absolute inset-0 w-full h-full text-secondary/70 hexagon-spin-slow pointer-events-none"
            viewBox="0 0 200 200"
            preserveAspectRatio="none"
          >
            <polygon
              points="100,4 186,50 186,150 100,196 14,150 14,50"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
            />
          </svg>
          <svg
            className="absolute inset-0 w-full h-full text-secondary/30 hexagon-spin-slow-reverse pointer-events-none"
            viewBox="0 0 200 200"
            preserveAspectRatio="none"
          >
            <polygon
              points="100,4 186,50 186,150 100,196 14,150 14,50"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.6"
            />
          </svg>

          {/* Floral corners */}
          <FloralFlower size={34} delay={0} className="absolute -top-4 -left-4 md:-left-8 text-secondary/60" />
          <FloralFlower size={34} delay={0.8} className="absolute -bottom-4 -right-4 md:-right-8 text-secondary/60" />

          {/* Content */}
          <div className="relative px-10 py-16 md:py-20">
            <span
              className="material-symbols-outlined text-secondary text-5xl mb-8 inline-block"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              format_quote
            </span>
            <h3 className="font-display text-headline-md-mobile md:text-headline-md text-primary italic mb-10 leading-relaxed">
              "Raj Caterers turned our dream wedding into a culinary masterpiece. The attention to detail and the exquisite flavors left our guests talking for months."
            </h3>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-white shadow-md image-placeholder">text</div>
              <p className="font-body text-label-caps uppercase text-secondary">The Henderson Family</p>
              <p className="font-body text-body-sm text-on-surface-variant">Annual Gala Hosts</p>
            </div>
          </div>
        </div>
      </div>

      <FloralStyles />
      <style>{`
        @keyframes hexagonSpinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes hexagonSpinSlowReverse {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        .hexagon-spin-slow { animation: hexagonSpinSlow 40s linear infinite; transform-origin: 50% 50%; }
        .hexagon-spin-slow-reverse { animation: hexagonSpinSlowReverse 55s linear infinite; transform-origin: 50% 50%; }
        @media (prefers-reduced-motion: reduce) {
          .hexagon-spin-slow, .hexagon-spin-slow-reverse { animation: none; }
        }
      `}</style>
    </section>
  );
}