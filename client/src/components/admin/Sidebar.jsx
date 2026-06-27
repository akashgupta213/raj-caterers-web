import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const LINKS = [
  { to: "/admin", icon: "dashboard", label: "Dashboard" },
  { to: "/admin/bookings", icon: "event", label: "Bookings" },
  { to: "/admin/clients", icon: "groups", label: "Clients" },
  { to: "/admin/menu", icon: "restaurant_menu", label: "Menu" },
  { to: "/admin/gallery", icon: "photo_library", label: "Gallery" },
  { to: "/admin/reviews", icon: "reviews", label: "Reviews" },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const nav = useNavigate();
  return (
    <aside className="w-64 min-h-screen bg-inverse-surface text-inverse-on-surface flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h2 className="font-display text-headline-md-mobile text-gold">Raj Caterers</h2>
        <p className="font-body text-label-caps uppercase opacity-70 mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {LINKS.map(l => (
          <NavLink key={l.to} to={l.to} end
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg font-body text-body-sm transition ${isActive ? "bg-secondary text-on-primary" : "hover:bg-white/5"}`}>
            <span className="material-symbols-outlined">{l.icon}</span>{l.label}
          </NavLink>
        ))}
      </nav>
      <button onClick={() => { logout(); nav("/admin/login"); }}
        className="m-4 flex items-center gap-3 px-4 py-3 rounded-lg font-body text-body-sm border border-white/10 hover:bg-white/5">
        <span className="material-symbols-outlined">logout</span>Logout
      </button>
    </aside>
  );
}
