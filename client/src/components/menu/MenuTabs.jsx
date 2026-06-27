import { MENU_CATEGORIES } from "../../utils/constants";
export default function MenuTabs({ active, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {MENU_CATEGORIES.map(c => (
        <button key={c} onClick={() => onChange(c)}
          className={`px-6 py-2 rounded-full font-body text-label-caps uppercase tracking-widest transition ${active === c ? "bg-secondary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"}`}>
          {c}
        </button>
      ))}
    </div>
  );
}
