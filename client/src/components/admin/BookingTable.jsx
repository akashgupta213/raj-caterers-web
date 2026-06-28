import { formatDate, formatCurrency } from "../../utils/helpers";

const STATUS_CONFIG = {
  "Pending":     { cls: "bg-amber-100 text-amber-700 border-amber-300",        locked: false },
  "Confirmed":   { cls: "bg-emerald-100 text-emerald-700 border-emerald-300",  locked: false },
  "In Progress": { cls: "bg-blue-100 text-blue-700 border-blue-300",           locked: false },
  "Completed":   { cls: "bg-slate-100 text-slate-700 border-slate-300",        locked: true  },
  "Cancelled":   { cls: "bg-red-100 text-red-700 border-red-300",              locked: true  },
};

const STATUSES = ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];

export default function BookingTable({ rows = [], onStatusChange }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden premium-shadow">
      <table className="w-full text-left">
        <thead className="bg-surface-container text-on-surface-variant font-body text-label-caps uppercase">
          <tr>
            {["Client", "Event", "Date", "Guests", "Amount", "Status", ""].map((h) => (
              <th key={h} className="px-6 py-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => {
            const config = STATUS_CONFIG[r.status] || { cls: "bg-gray-100 text-gray-700 border-gray-300", locked: false };

            return (
              <tr key={r._id || r.id} className="border-t border-outline-variant text-body-sm">
                <td className="px-6 py-4 font-medium text-primary">{r.clientName}</td>
                <td className="px-6 py-4">{r.eventType}</td>
                <td className="px-6 py-4">{formatDate(r.eventDate)}</td>
                <td className="px-6 py-4">{r.guestCount ?? "—"}</td>
                <td className="px-6 py-4">
                  {formatCurrency(r.totalAmount > 0 ? r.totalAmount : (r.estimatedBudget || 0))}
                </td>

                <td className="px-6 py-4">
                  {config.locked ? (
                    /* Locked — show plain badge */
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase border ${config.cls}`}>
                      <span className="material-symbols-outlined text-[11px]">lock</span>
                      {r.status}
                    </span>
                  ) : onStatusChange ? (
                    /* Editable — styled wrapper hides native arrow */
                    <div className={`relative inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase border ${config.cls}`}>
                      <span>{r.status}</span>
                      <span className="material-symbols-outlined text-[13px] ml-1">expand_more</span>
                      <select
                        value={r.status}
                        onChange={(e) => onStatusChange(r._id, e.target.value)}
                        className="absolute inset-0 w-full opacity-0 cursor-pointer"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase border ${config.cls}`}>
                      {r.status}
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <button className="text-secondary hover:underline font-body text-body-sm">View</button>
                </td>
              </tr>
            );
          })}

          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center font-body text-body-sm text-on-surface-variant">
                No bookings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}