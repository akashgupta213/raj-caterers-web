// Lightweight decorative flourishes used across the home page sections.
// Line-art botanical SVGs (not emoji) so they sit naturally in a premium,
// gold-accented aesthetic. Purely decorative — aria-hidden and skipped
// under prefers-reduced-motion.

export function FloralFlower({ className = "", size = 32, delay = 0, animate = "sway" }) {
  return (
    <span
      className={`inline-block select-none pointer-events-none ${animate === "sway" ? "floral-sway" : "floral-float"} ${className}`}
      style={{ animationDelay: `${delay}s`, width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
        <g stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
          <ellipse cx="24" cy="10" rx="5" ry="9" transform="rotate(0 24 24)" />
          <ellipse cx="24" cy="10" rx="5" ry="9" transform="rotate(72 24 24)" />
          <ellipse cx="24" cy="10" rx="5" ry="9" transform="rotate(144 24 24)" />
          <ellipse cx="24" cy="10" rx="5" ry="9" transform="rotate(216 24 24)" />
          <ellipse cx="24" cy="10" rx="5" ry="9" transform="rotate(288 24 24)" />
        </g>
        <circle cx="24" cy="24" r="2.6" fill="currentColor" opacity="0.85" />
      </svg>
    </span>
  );
}

export function FloralSprig({ className = "", size = 36, delay = 0, flip = false }) {
  return (
    <span
      className={`inline-block select-none pointer-events-none floral-float ${className}`}
      style={{
        animationDelay: `${delay}s`,
        width: size,
        height: size * 1.5,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 60" width={size} height={size * 1.5} fill="none">
        <g stroke="currentColor" strokeLinecap="round">
          <path d="M20 58 C18 40 22 20 20 2" strokeWidth="1.2" />
          <path d="M20 46 C12 42 6 34 4 26" strokeWidth="1" />
          <path d="M20 34 C28 30 34 22 36 14" strokeWidth="1" />
          <path d="M20 20 C14 16 10 10 9 4" strokeWidth="1" />
        </g>
      </svg>
    </span>
  );
}

export function FloralStyles() {
  return (
    <style>{`
      @keyframes floralSway {
        0%, 100% { transform: rotate(-6deg) translateY(0); }
        50% { transform: rotate(6deg) translateY(-6px); }
      }
      .floral-sway { animation: floralSway 4.5s ease-in-out infinite; transform-origin: center; }

      @keyframes floralFloat {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-10px) rotate(4deg); }
      }
      .floral-float { animation: floralFloat 5.5s ease-in-out infinite; }

      @keyframes revealUp {
        from { opacity: 0; transform: translateY(28px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .reveal-up { animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }

      @media (prefers-reduced-motion: reduce) {
        .floral-sway, .floral-float, .reveal-up { animation: none !important; }
      }
    `}</style>
  );
}