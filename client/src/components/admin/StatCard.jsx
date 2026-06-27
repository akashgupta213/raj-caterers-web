export default function StatCard({ icon, label, value, trend }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 premium-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {trend && <span className="text-body-sm text-tertiary">{trend}</span>}
      </div>
      <div className="font-display text-headline-md text-primary">{value}</div>
      <div className="font-body text-label-caps uppercase text-on-surface-variant tracking-widest mt-1">{label}</div>
    </div>
  );
}
