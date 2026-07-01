import { useState, useEffect, useRef } from "react";
import SectionHeading from "../components/common/SectionHeading";
import ReviewCard from "../components/reviews/ReviewCard";
import StarRating from "../components/reviews/StarRating";
import api from "../utils/api";

// ─── Constants ────────────────────────────────────────────────────────────────
const EVENT_TYPES = [
  "Wedding", "Engagement", "Birthday",
  "Corporate", "Private Dining", "Social Soiree", "Other",
];
const MAX_CHARS = 500;
const EMPTY_FORM = {
  clientName: "", clientRole: "", eventType: "",
  eventDate: "", rating: 0, review: "",
  _hp: "", // honeypot — never shown to users
};

// ─── Star picker (for the form) ───────────────────────────────────────────────
function StarPicker({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  const labels = ["Terrible", "Poor", "Average", "Good", "Excellent"];
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="text-3xl transition-colors leading-none"
            style={{ color: star <= (hovered || value) ? "#c9a84c" : "#d1d5db" }}
            aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          >
            ★
          </button>
        ))}
      </div>
      {(hovered || value) > 0 && (
        <p className="font-body text-body-sm text-secondary">
          {labels[(hovered || value) - 1]}
        </p>
      )}
    </div>
  );
}

// ─── Filter/sort bar ──────────────────────────────────────────────────────────
function FilterBar({ activeType, setActiveType, activeRating, setActiveRating, sort, setSort }) {
  return (
    <div className="flex flex-wrap gap-3 mb-10">
      {/* Event type pills */}
      <div className="flex flex-wrap gap-2">
        {["All", ...EVENT_TYPES].map(t => (
          <button
            key={t}
            onClick={() => setActiveType(t)}
            className={`px-4 py-1.5 rounded-full font-body text-[11px] uppercase tracking-widest border transition-all
              ${activeType === t
                ? "bg-primary text-on-primary border-primary"
                : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="w-px bg-outline-variant self-stretch hidden sm:block" />

      {/* Rating filter */}
      <div className="flex flex-wrap gap-2">
        {["All", "5", "4+"].map(r => (
          <button
            key={r}
            onClick={() => setActiveRating(r)}
            className={`px-4 py-1.5 rounded-full font-body text-[11px] uppercase tracking-widest border transition-all whitespace-nowrap
              ${activeRating === r
                ? "bg-primary text-on-primary border-primary"
                : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
          >
            {r === "All" ? "All Ratings" : r === "5" ? "★ 5 only" : "★ 4+"}
          </button>
        ))}
      </div>

      {/* Sort */}
      <select
        value={sort}
        onChange={e => setSort(e.target.value)}
        className="ml-auto px-4 py-1.5 rounded-full border border-outline-variant font-body text-[11px] uppercase tracking-widest text-on-surface-variant bg-surface focus:outline-none focus:border-primary"
      >
        <option value="newest">Newest first</option>
        <option value="helpful">Most helpful</option>
        <option value="rating_high">Highest rated</option>
        <option value="rating_low">Lowest rated</option>
      </select>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Reviews() {
  const [reviews,    setReviews]    = useState([]);
  const [avgRating,  setAvgRating]  = useState(0);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);

  // filters
  const [activeType,   setActiveType]   = useState("All");
  const [activeRating, setActiveRating] = useState("All");
  const [sort,         setSort]         = useState("newest");

  // modal
  const [showModal,  setShowModal]  = useState(false);
  const [form,       setForm]       = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState("");

  const modalRef = useRef(null);

  // ── Fetch reviews ──
  useEffect(() => {
    api.get("/reviews")
      .then(res => {
        const data = res.data?.data ?? res.data;
        setReviews(data?.reviews ?? []);
        setAvgRating(data?.avgRating ?? 0);
        setTotal(data?.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Close modal on Escape ──
  useEffect(() => {
    const handler = e => { if (e.key === "Escape") closeModal(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // ── Derived: filtered + sorted reviews ──
  const displayed = reviews
    .filter(r => activeType === "All" || r.eventType === activeType)
    .filter(r => {
      if (activeRating === "5")  return r.rating === 5;
      if (activeRating === "4+") return r.rating >= 4;
      return true;
    })
    .sort((a, b) => {
      if (sort === "helpful")      return (b.helpfulCount ?? 0) - (a.helpfulCount ?? 0);
      if (sort === "rating_high")  return b.rating - a.rating;
      if (sort === "rating_low")   return a.rating - b.rating;
      return new Date(b.createdAt) - new Date(a.createdAt); // newest
    });

  // ── Form handlers ──
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    // Honeypot check — if filled, silently fake success
    if (form._hp) { setSubmitted(true); return; }

    if (!form.clientName.trim()) return setError("Please enter your name.");
    if (!form.rating)            return setError("Please select a star rating.");
    if (!form.review.trim())     return setError("Please write your review.");
    if (form.review.length > MAX_CHARS) return setError(`Review must be under ${MAX_CHARS} characters.`);

    setError("");
    setSubmitting(true);
    try {
      const { _hp, ...payload } = form; // strip honeypot before sending
      const res = await api.post("/reviews", payload);
      const newReview = res.data?.data ?? res.data;

      // Show it on the site immediately instead of waiting for a refetch/approval.
      // Falls back to the submitted form data if the API doesn't echo back the created record.
      const reviewToShow = newReview && newReview._id
        ? newReview
        : { ...payload, _id: `temp-${Date.now()}`, createdAt: new Date().toISOString(), helpfulCount: 0, isVerified: false };

      setReviews(prev => [reviewToShow, ...prev]);
      setTotal(t => t + 1);
      setAvgRating(prevAvg => {
        const prevTotal = total;
        const newTotal = prevTotal + 1;
        return Math.round((((prevAvg * prevTotal) + reviewToShow.rating) / newTotal) * 10) / 10;
      });

      setSubmitted(true);
      setForm(EMPTY_FORM);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSubmitted(false);
    setForm(EMPTY_FORM);
    setError("");
  };

  const charsLeft = MAX_CHARS - form.review.length;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <div>
          <SectionHeading eyebrow="Kind Words" title="Client Reviews" />
          {!loading && total > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <div className="flex text-gold">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: i <= Math.round(avgRating) ? "'FILL' 1" : "'FILL' 0" }}>
                    star
                  </span>
                ))}
              </div>
              <span className="font-body text-body-sm text-on-surface-variant">
                {avgRating} average · {total} review{total !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="self-start sm:self-auto px-6 py-3 rounded-full bg-primary text-on-primary font-body text-label-caps uppercase tracking-widest hover:opacity-90 transition-opacity"
        >
          Write a Review
        </button>
      </div>

      {/* Filter bar */}
      {!loading && reviews.length > 0 && (
        <FilterBar
          activeType={activeType}   setActiveType={setActiveType}
          activeRating={activeRating} setActiveRating={setActiveRating}
          sort={sort}               setSort={setSort}
        />
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-surface-container-lowest rounded-xl p-8 premium-shadow animate-pulse h-52" />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-body text-body-lg text-on-surface-variant">
            {reviews.length === 0
              ? "No reviews yet — be the first!"
              : "No reviews match your filters."}
          </p>
          {reviews.length > 0 && (
            <button
              onClick={() => { setActiveType("All"); setActiveRating("All"); }}
              className="mt-4 font-body text-label-caps uppercase tracking-widest text-secondary underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {displayed.map(r => (
            <ReviewCard
              key={r._id}
              id={r._id}
              name={r.clientName}
              event={[r.eventType, r.clientRole].filter(Boolean).join(" · ")}
              rating={r.rating}
              text={r.review}
              isVerified={r.isVerified ?? false}
              helpfulCount={r.helpfulCount ?? 0}
              avatarUrl={r.avatarUrl ?? null}
            />
          ))}
        </div>
      )}

      {/* ── Submit Modal ────────────────────────────────────────────────────── */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={e => e.target === e.currentTarget && closeModal()}
        >
          <div
            ref={modalRef}
            className="bg-surface rounded-2xl p-8 w-full max-w-lg premium-shadow relative my-auto"
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-5 text-on-surface-variant text-2xl leading-none hover:text-primary transition-colors"
              aria-label="Close"
            >
              ×
            </button>

            {submitted ? (
              /* ── Success state ── */
              <div className="text-center py-8">
                <p className="text-5xl mb-4">🙏</p>
                <h3 className="font-display text-headline-sm text-primary mb-2">Thank you!</h3>
                <p className="font-body text-body-lg text-on-surface-variant">
                  Thanks for your feedback — your review is now live on the site.
                </p>
                <button
                  onClick={closeModal}
                  className="mt-6 px-6 py-2 rounded-full bg-primary text-on-primary font-body text-label-caps uppercase tracking-widest"
                >
                  Done
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <>
                <h2 className="font-display text-headline-sm text-primary mb-1">Share your experience</h2>
                <p className="font-body text-body-sm text-on-surface-variant mb-6">
                  What did you love most? How was the food and service?
                </p>

                {/* Honeypot — visually hidden, bots fill this in */}
                <div style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
                  <input name="_hp" value={form._hp} onChange={handleChange} tabIndex={-1} autoComplete="off" />
                </div>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="font-body text-label-caps uppercase tracking-widest text-secondary block mb-1">
                      Your Name <span className="text-error">*</span>
                    </label>
                    <input
                      name="clientName" value={form.clientName} onChange={handleChange}
                      placeholder="e.g. Priya & Arjun Sharma"
                      className="w-full border border-outline-variant rounded-xl px-4 py-3 font-body text-body-lg bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  {/* Event type + date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-body text-label-caps uppercase tracking-widest text-secondary block mb-1">Event Type</label>
                      <select
                        name="eventType" value={form.eventType} onChange={handleChange}
                        className="w-full border border-outline-variant rounded-xl px-4 py-3 font-body text-body-lg bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary transition-colors"
                      >
                        <option value="">Select…</option>
                        {EVENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="font-body text-label-caps uppercase tracking-widest text-secondary block mb-1">Event Date</label>
                      <input
                        type="date" name="eventDate" value={form.eventDate} onChange={handleChange}
                        className="w-full border border-outline-variant rounded-xl px-4 py-3 font-body text-body-lg bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="font-body text-label-caps uppercase tracking-widest text-secondary block mb-2">
                      Rating <span className="text-error">*</span>
                    </label>
                    <StarPicker value={form.rating} onChange={v => setForm(f => ({ ...f, rating: v }))} />
                  </div>

                  {/* Review text + char counter */}
                  <div>
                    <label className="font-body text-label-caps uppercase tracking-widest text-secondary block mb-1">
                      Your Review <span className="text-error">*</span>
                    </label>
                    <textarea
                      name="review" value={form.review} onChange={handleChange}
                      rows={4}
                      maxLength={MAX_CHARS}
                      placeholder="Tell us about your experience — the food, the team, the moments that stood out…"
                      className="w-full border border-outline-variant rounded-xl px-4 py-3 font-body text-body-lg bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                    <p className={`font-body text-[11px] text-right mt-1 ${charsLeft < 50 ? "text-error" : "text-on-surface-variant"}`}>
                      {charsLeft} characters remaining
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <p className="font-body text-body-sm text-error flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">error</span>
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-3 rounded-full bg-primary text-on-primary font-body text-label-caps uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {submitting ? "Submitting…" : "Submit Review"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}