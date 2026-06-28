import { formatDate, formatCurrency } from "../../utils/helpers";
export default function BookingTable({ rows = [] }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden premium-shadow">
      <table className="w-full text-left">
        <thead className="bg-surface-container text-on-surface-variant font-body text-label-caps uppercase">
          <tr>{["Client", "Event", "Date", "Guests", "Amount", "Status", ""].map(h => <th key={h} className="px-6 py-4">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r._id || r.id} className="border-t border-outline-variant text-body-sm">
              <td className="px-6 py-4 font-medium text-primary">{r.clientName}</td>
              <td className="px-6 py-4">{r.eventType}</td>
              <td className="px-6 py-4">{formatDate(r.eventDate)}</td>
              <td className="px-6 py-4">{r.guestsCount}</td>
              <td className="px-6 py-4">{formatCurrency(r.totalAmount || 0)}</td>
              <td className="px-6 py-4">
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${r.status === "Confirmed" ? "bg-tertiary-container text-on-tertiary-container" : r.status === "Pending" ? "bg-secondary-fixed text-on-secondary-container" : "bg-error-container text-on-error-container"}`}>{r.status}</span>
              </td>
              <td className="px-6 py-4"><button className="text-secondary hover:underline">View</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
