export default function PackageCard({ name, price, perks = [], featured }) {
  return (
    <div className={`rounded-xl p-8 premium-shadow ${featured ? "bg-secondary text-on-primary" : "bg-surface-container-lowest"}`}>
      <h3 className={`font-display text-title-lg mb-2 ${featured ? "text-white" : "text-secondary"}`}>{name}</h3>
      <div className={`font-display text-headline-md mb-6 ${featured ? "text-gold" : "text-primary"}`}>{price}</div>
      <ul className="space-y-3 mb-8">
        {perks.map(p => (
          <li key={p} className="flex items-start gap-2 text-body-sm">
            <span className="material-symbols-outlined text-base mt-0.5">check_circle</span>{p}
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-full font-body text-label-caps uppercase ${featured ? "bg-gold text-on-background" : "bg-secondary text-on-primary"}`}>Choose Package</button>
    </div>
  );
}
