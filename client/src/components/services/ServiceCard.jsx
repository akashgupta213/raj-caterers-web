export default function ServiceCard({ title, desc, features = [] }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl premium-shadow overflow-hidden hover:-translate-y-2 transition">
      <div className="h-56 image-placeholder">text here</div>
      <div className="p-8">
        <h3 className="font-display text-title-lg text-secondary mb-3">{title}</h3>
        <p className="font-body text-body-sm text-on-surface-variant mb-6">{desc}</p>
        <ul className="space-y-2">
          {features.map(f => (
            <li key={f} className="flex items-start gap-2 text-body-sm">
              <span className="material-symbols-outlined text-secondary text-base mt-0.5">check_circle</span>{f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
