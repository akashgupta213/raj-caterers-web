import { useEffect, useState } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";
import { FloralFlower, FloralStyles } from "../common/FloralDecor";

const STATS = [
  { n: "500+", l: "Events Catered" },
  { n: "25", l: "Years of Excellence" },
  { n: "98%", l: "Client Retention" },
  { n: "50+", l: "Master Chefs" },
];

function CountUpStat({ stat, visible, delay }) {
  const numericTarget = parseInt(stat.n.replace(/[^\d]/g, ""), 10) || 0;
  const suffix = stat.n.replace(/[\d]/g, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    let raf;
    const duration = 1400;
    const start = performance.now() + delay;

    const tick = (now) => {
      const elapsed = now - start;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numericTarget));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, numericTarget, delay]);

  return (
    <div className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
      <div className="font-display text-headline-md text-gold">
        {count}{suffix}
      </div>
      <div className="font-body text-label-caps uppercase tracking-widest mt-2 opacity-80">{stat.l}</div>
    </div>
  );
}

export default function StatsBar() {
  const [ref, visible] = useScrollReveal({ threshold: 0.4 });

  return (
    <section ref={ref} className="relative bg-primary text-on-primary py-16 overflow-hidden">
      {/* Subtle floral divider */}
      <div className="flex justify-center gap-6 mb-8 text-gold/50">
        <FloralFlower size={18} delay={0} />
        <FloralFlower size={18} delay={0.6} />
        <FloralFlower size={18} delay={1.2} />
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map((s, i) => (
          <CountUpStat key={s.l} stat={s} visible={visible} delay={i * 150} />
        ))}
      </div>

      <FloralStyles />
    </section>
  );
}