import { useEffect, useRef, useState } from "react";

/**
 * useScrollReveal
 * Returns [ref, visible] — attach ref to the element you want to animate in,
 * `visible` flips to true the first time it enters the viewport.
 *
 * Usage:
 *   const [ref, visible] = useScrollReveal();
 *   <div ref={ref} className={visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}>
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // If already in view on mount (e.g. above the fold), reveal immediately.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px", ...options }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, visible];
}