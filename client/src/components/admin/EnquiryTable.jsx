import { formatDate } from "../../utils/helpers";
export default function EnquiryTable({ rows = [] }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden premium-shadow">
      <table className="w-full text-left">
        <thead className="bg-surface-container text-on-surface-variant font-body text-label-caps uppercase">
          <tr>{["Name", "Email", "Event Type", "Date", "Guests", ""].map(h => <th key={h} className="px-6 py-4">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r._id || r.id} className="border-t border-outline-variant text-body-sm">
              <td className="px-6 py-4 font-medium text-primary">{r.fullName}</td>
              <td className="px-6 py-4">{r.email}</td>
              <td className="px-6 py-4">{r.eventType}</td>
              <td className="px-6 py-4">{r.preferredDate ? formatDate(r.preferredDate) : "—"}</td>
              <td className="px-6 py-4">{r.estimatedGuests}</td>
              <td className="px-6 py-4"><button className="text-secondary hover:underline">Reply</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
