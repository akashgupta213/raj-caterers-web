const CATS = ["All", "Weddings", "Corporate", "Private", "Social"];
export default function GalleryFilter({ active, onChange }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {CATS.map(c => (
        <button key={c} onClick={() => onChange(c)}
          className={`px-5 py-2 rounded-full font-body text-label-caps uppercase tracking-widest transition ${active === c ? "bg-secondary text-on-primary" : "border border-outline-variant text-on-surface-variant hover:border-secondary"}`}>
          {c}
        </button>
      ))}
    </div>
  );
}
