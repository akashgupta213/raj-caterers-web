export default function RevenueChart() {
  const data = [40, 65, 55, 80, 72, 95, 88, 110, 96, 120, 105, 130];
  const max = Math.max(...data);
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 premium-shadow">
      <h3 className="font-display text-title-lg text-primary mb-6">Revenue Trend</h3>
      <div className="flex items-end gap-2 h-48">
        {data.map((v, i) => (
          <div key={i} className="flex-1 bg-secondary/30 hover:bg-secondary transition rounded-t" style={{ height: `${(v / max) * 100}%` }} title={`₹${v}k`} />
        ))}
      </div>
      <div className="flex justify-between text-[11px] font-body uppercase text-on-surface-variant mt-2">
        {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m, i) => <span key={i}>{m}</span>)}
      </div>
    </div>
  );
}
