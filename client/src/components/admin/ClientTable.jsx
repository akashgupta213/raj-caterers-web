export default function RevenueChart({ monthlyData = [] }) {
  const MONTHS = ["J","F","M","A","M","J","J","A","S","O","N","D"];
  const FALLBACK = [40, 65, 55, 80, 72, 95, 88, 110, 96, 120, 105, 130].map(v => v * 1000);

  const data = monthlyData.length
    ? MONTHS.map((_, i) => {
        const found = monthlyData.find((d) => d._id === i + 1);
        return found ? found.count : 0;
      })
    : FALLBACK;

  const max = Math.max(...data) || 1;

  const fmt = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${(n/1000).toFixed(0)}k`;

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 premium-shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display text-title-lg text-primary">Revenue Trend</h3>
        <span className="font-body text-body-sm text-on-surface-variant">
          Total: {fmt(data.reduce((a, b) => a + b, 0))}
        </span>
      </div>
      <div className="flex items-end gap-2 h-48">
        {data.map((v, i) => (
          <div
            key={i}
            className="flex-1 bg-secondary/30 hover:bg-secondary transition rounded-t cursor-default"
            style={{ height: `${(v / max) * 100}%` }}
            title={fmt(v)}
          />
        ))}
      </div>
      <div className="flex justify-between text-[11px] font-body uppercase text-on-surface-variant mt-2">
        {MONTHS.map((m, i) => <span key={i}>{m}</span>)}
      </div>
    </div>
  );
}