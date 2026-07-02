import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const LINKS = [
  { to: "/admin",          icon: "dashboard",      label: "Dashboard" },
  { to: "/admin/bookings", icon: "event",           label: "Bookings" },
  { to: "/admin/clients",  icon: "groups",          label: "Clients" },
  { to: "/admin/menu",     icon: "restaurant_menu", label: "Menu" },
  { to: "/admin/gallery",  icon: "photo_library",   label: "Gallery" },
  { to: "/admin/banquet-halls",icon: "meeting_room",    label: "Banquet Halls" },
    { to: "/admin/hall-enquiries",icon: "mark_email_unread",label: "Hall Enquiries" },
  { to: "/admin/reviews",  icon: "reviews",         label: "Reviews" },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {/* Mobile top bar — hidden on desktop */}
      <div className="md:hidden flex items-center justify-between bg-inverse-surface text-inverse-on-surface px-4 py-3 sticky top-0 z-40">
        <h2 className="font-display text-title-lg text-gold">Raj Caterers</h2>
        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition"
          aria-label="Open menu"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      {/* Backdrop — mobile only */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={close}
        />
      )}

      {/* Desktop sidebar — hidden on mobile, shown via drawer on mobile */}
      <aside
        className={`
          fixed md:sticky md:top-0
          top-0 left-0
          h-screen md:h-screen
          w-64 shrink-0
          bg-inverse-surface text-inverse-on-surface
          flex flex-col
          z-50
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="font-display text-headline-md-mobile text-gold">Raj Caterers</h2>
            <p className="font-body text-label-caps uppercase opacity-70 mt-1">Admin Panel</p>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={close}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition"
            aria-label="Close menu"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {LINKS.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              onClick={close}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg font-body text-body-sm transition ${
                  isActive ? "bg-secondary text-on-primary" : "hover:bg-white/5"
                }`
              }
            >
              <span className="material-symbols-outlined">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={() => { logout(); nav("/admin/login"); }}
          className="m-4 flex items-center gap-3 px-4 py-3 rounded-lg font-body text-body-sm border border-white/10 hover:bg-white/5 transition"
        >
          <span className="material-symbols-outlined">logout</span>
          Logout
        </button>
      </aside>
    </>
  );
}