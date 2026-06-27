export default function StatsCounter({ stats = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {stats.map(s => (
        <div key={s.label}>
          <div className="font-display text-display-lg-mobile text-secondary">{s.value}</div>
          <div className="font-body text-label-caps uppercase tracking-widest text-on-surface-variant mt-2">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
