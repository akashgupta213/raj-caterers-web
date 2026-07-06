import { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import StarRating from "../../components/reviews/StarRating";
import { fetchReviewsAdmin, updateReview, deleteReview } from "../../utils/api";
import { useConfirm } from "../../hooks/useConfirm";
import ConfirmDialog from "../../components/common/ConfirmDialog";

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("all"); // all | pending | approved

  const { confirm, dialog, handleConfirm, handleCancel } = useConfirm();

  const load = () => {
    setLoading(true);
    fetchReviewsAdmin().then(setReviews).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleApprove  = (id) => updateReview(id, { isApproved: true  }).then(load);
  const handleReject   = (id) => updateReview(id, { isApproved: false }).then(load);
  const handleVerify   = (id, current) => updateReview(id, { isVerified: !current }).then(load);
  const handleFeature  = (id, current) => updateReview(id, { isFeatured: !current }).then(load);

  const handleDelete = async (id) => {
    const ok = await confirm("Delete this review permanently?");
    if (!ok) return;
    deleteReview(id).then(load);
  };

  const displayed = reviews.filter(r => {
    if (filter === "pending")  return !r.isApproved;
    if (filter === "approved") return  r.isApproved;
    return true;
  });

  const pendingCount = reviews.filter(r => !r.isApproved).length;

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 bg-surface p-4 md:p-8 min-h-screen overflow-x-hidden">

        {/* Header — stacks on mobile, side-by-side on desktop */}
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <h1 className="font-display text-headline-md text-primary">Manage Reviews</h1>
            {pendingCount > 0 && (
              <p className="font-body text-body-sm text-error mt-1">
                {pendingCount} review{pendingCount > 1 ? "s" : ""} awaiting approval
              </p>
            )}
          </div>

          {/* Filter tabs — full width row, wraps cleanly */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all",      label: "All" },
              { key: "pending",  label: `Pending${pendingCount ? ` (${pendingCount})` : ""}` },
              { key: "approved", label: "Approved" },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-2 rounded-full font-body text-label-caps uppercase tracking-widest text-[11px] border transition-all
                  ${filter === tab.key
                    ? "bg-primary text-on-primary border-primary"
                    : "border-outline-variant text-on-surface-variant hover:border-primary"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid — 1 col on mobile, 2 on desktop */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-gutter">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-surface-container-lowest rounded-xl p-6 premium-shadow animate-pulse h-52" />
            ))}
          </div>
        ) : displayed.length === 0 ? (
          <p className="font-body text-body-sm text-on-surface-variant">No reviews in this category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-gutter">
            {displayed.map(r => (
              <div key={r._id} className="bg-surface-container-lowest rounded-xl p-4 md:p-6 premium-shadow flex flex-col gap-4">

                {/* Top row */}
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-title-lg text-primary truncate">{r.clientName}</h3>
                    <p className="font-body text-body-sm text-on-surface-variant">
                      {[r.eventType, r.clientRole].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                    r.isApproved
                      ? "bg-tertiary-container text-on-tertiary-container"
                      : "bg-secondary-fixed text-on-secondary-container"
                  }`}>
                    {r.isApproved ? "Approved" : "Pending"}
                  </span>
                </div>

                <StarRating value={r.rating} />

                <p className="font-body text-body-lg italic text-on-surface">"{r.review}"</p>

                {/* Meta */}
                <div className="flex flex-wrap gap-3 text-[11px] font-body uppercase tracking-widest text-on-surface-variant">
                  {r.helpfulCount > 0 && <span>👍 {r.helpfulCount} helpful</span>}
                  {r.eventDate && (
                    <span>📅 {new Date(r.eventDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
                  )}
                </div>

                {/* Action buttons — wrap on mobile */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-outline-variant">
                  {!r.isApproved ? (
                    <button onClick={() => handleApprove(r._id)}
                      className="px-4 py-2 rounded-full bg-secondary text-on-secondary font-body text-label-caps uppercase text-[11px]">
                      Approve
                    </button>
                  ) : (
                    <button onClick={() => handleReject(r._id)}
                      className="px-4 py-2 rounded-full border border-error text-error font-body text-label-caps uppercase text-[11px]">
                      Unapprove
                    </button>
                  )}

                  <button
                    onClick={() => handleVerify(r._id, r.isVerified)}
                    className={`px-4 py-2 rounded-full border font-body text-label-caps uppercase text-[11px] transition-all
                      ${r.isVerified
                        ? "bg-tertiary-container text-on-tertiary-container border-tertiary-container"
                        : "border-outline-variant text-on-surface-variant hover:border-tertiary"
                      }`}
                  >
                    {r.isVerified ? "✓ Verified" : "Mark Verified"}
                  </button>

                  <button
                    onClick={() => handleFeature(r._id, r.isFeatured)}
                    className={`px-4 py-2 rounded-full border font-body text-label-caps uppercase text-[11px] transition-all
                      ${r.isFeatured
                        ? "bg-primary-container text-on-primary-container border-primary-container"
                        : "border-outline-variant text-on-surface-variant hover:border-primary"
                      }`}
                  >
                    {r.isFeatured ? "★ Featured" : "Feature"}
                  </button>

                  <button onClick={() => handleDelete(r._id)}
                    className="ml-auto px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-body text-label-caps uppercase text-[11px] hover:border-error hover:text-error transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ConfirmDialog {...dialog} onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  );
}