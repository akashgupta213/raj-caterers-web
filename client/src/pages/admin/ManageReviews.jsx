import Sidebar from "../../components/admin/Sidebar";
import StarRating from "../../components/reviews/StarRating";

const REVIEWS = [
  { name: "Aanya Sharma", event: "Wedding", rating: 5, text: "Stunning food and service.", status: "Pending" },
  { name: "Acme Corp", event: "Corporate Gala", rating: 5, text: "Flawless execution for 600 guests.", status: "Approved" },
];

export default function ManageReviews() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-surface p-8 min-h-screen">
        <h1 className="font-display text-headline-md text-primary mb-8">Manage Reviews</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {REVIEWS.map((r, i) => (
            <div key={i} className="bg-surface-container-lowest rounded-xl p-6 premium-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-display text-title-lg text-primary">{r.name}</h3>
                  <p className="font-body text-body-sm text-on-surface-variant">{r.event}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${r.status === "Approved" ? "bg-tertiary-container text-on-tertiary-container" : "bg-secondary-fixed text-on-secondary-container"}`}>{r.status}</span>
              </div>
              <StarRating value={r.rating} />
              <p className="font-body text-body-lg italic text-on-surface my-4">"{r.text}"</p>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-full bg-secondary text-on-primary font-body text-label-caps uppercase">Approve</button>
                <button className="px-4 py-2 rounded-full border border-error text-error font-body text-label-caps uppercase">Reject</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
