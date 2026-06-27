import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { NAV_LINKS } from "../../utils/constants";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav shadow-[0_4px_30px_rgba(139,76,77,0.05)]">
      <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="font-display text-xl md:text-2xl text-primary whitespace-nowrap"
          >
            Raj Caterers
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.path}
                to={l.path}
                end
                className={({ isActive }) =>
                  `font-body text-sm xl:text-base pb-1 transition-all duration-300 ${
                    isActive
                      ? "text-secondary border-b-2 border-secondary"
                      : "text-on-surface-variant hover:text-primary"
                  }`
                }
              >
                {l.name}
              </NavLink>
            ))}
          </div>

          {/* Right side: CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <Link
              to="/enquire"
              className="hidden md:inline-flex items-center bg-secondary text-on-primary px-6 py-2.5 rounded-full font-body text-xs uppercase tracking-wider hover:opacity-90 transition transform hover:scale-105"
            >
              Book Now
            </Link>
            <button
              className="lg:hidden p-2 -mr-2 text-primary"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              <span className="material-symbols-outlined text-3xl">
                {open ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-surface-container-lowest border-t border-outline-variant px-4 sm:px-6 py-4 space-y-1">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.path}
              to={l.path}
              end
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-lg font-body text-base text-on-surface-variant hover:text-secondary hover:bg-black/5 transition-colors"
            >
              {l.name}
            </NavLink>
          ))}
          <Link
            to="/enquire"
            onClick={() => setOpen(false)}
            className="block text-center bg-secondary text-on-primary py-3 rounded-full font-body text-xs uppercase tracking-wider mt-4"
          >
            Book Now
          </Link>
        </div>
      )}
    </nav>
  );
}
