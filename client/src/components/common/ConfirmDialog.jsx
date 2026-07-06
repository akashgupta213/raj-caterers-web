export default function ConfirmDialog({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-surface rounded-2xl premium-shadow w-full max-w-sm p-6 animate-[fadeIn_0.15s_ease-out]">
        <h3 className="font-display text-title-lg text-primary mb-2">{title}</h3>
        <p className="font-body text-body-sm text-on-surface-variant mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-outline-variant text-on-surface-variant py-2.5 rounded-full font-body text-[11px] uppercase tracking-wider hover:border-secondary transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white py-2.5 rounded-full font-body text-[11px] uppercase tracking-wider hover:bg-red-600 transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}