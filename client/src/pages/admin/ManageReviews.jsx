import { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import StarRating from "../../components/reviews/StarRating";
import { fetchReviewsAdmin, updateReview, deleteReview } from "../../utils/api";

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchReviewsAdmin().then(setReviews).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleApprove = (id) => updateReview(id, { isApproved: true  }).then(load);
  const handleReject  = (id) => updateReview(id, { isApproved: false }).then(load);
  const handleDelete  = (id) => deleteReview(id).then(load);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-surface p-8 min-h-screen">
        <h1 className="font-display text-headline-md text-primary mb-8">Manage Reviews</h1>
        {loading ? (
          <p className="font-body text-body-sm text-on-surface-variant">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            {reviews.map((r) => (
              <div key={r._id} className="bg-surface-container-lowest rounded-xl p-6 premium-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    {/* clientName and eventType — actual model fields */}
                    <h3 className="font-display text-title-lg text-primary">{r.clientName}</h3>
                    <p className="font-body text-body-sm text-on-surface-variant">{r.eventType}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                    r.isApproved
                      ? "bg-tertiary-container text-on-tertiary-container"
                      : "bg-secondary-fixed text-on-secondary-container"
                  }`}>
                    {r.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>
                <StarRating value={r.rating} />
                {/* review — actual model field, not "text" */}
                <p className="font-body text-body-lg italic text-on-surface my-4">"{r.review}"</p>
                <div className="flex gap-3">
                  {!r.isApproved && (
                    <button onClick={() => handleApprove(r._id)} className="px-4 py-2 rounded-full bg-secondary text-on-primary font-body text-label-caps uppercase">Approve</button>
                  )}
                  <button onClick={() => handleReject(r._id)} className="px-4 py-2 rounded-full border border-error text-error font-body text-label-caps uppercase">Reject</button>
                  <button onClick={() => handleDelete(r._id)} className="px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-body text-label-caps uppercase">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}