import { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import BookingTable from "../../components/admin/BookingTable";
import { useBookings } from "../../hooks/useBookings";
import api, { updateBooking } from "../../utils/api";

/* ─── constants ─────────────────────────────────────────────────────────── */
const FILTERS     = ["All", "Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];
const EVENT_TYPES = ["Wedding", "Engagement", "Birthday", "Corporate", "Private Dining", "Social Soiree", "Other"];
const PACKAGES    = ["Basic", "Premium", "Royal", "Custom"];

/* ═══════════════════════════════════════════════════════════════════════════
   NEW BOOKING MODAL
═══════════════════════════════════════════════════════════════════════════ */
function NewBookingModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    clientName: "", clientEmail: "", clientPhone: "",
    eventType: "", eventDate: "", eventTime: "", venue: "",
    guestCount: "", packageType: "Custom",
    estimatedBudget: "", specialRequests: "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/bookings", {
        ...form,
        guestCount:      Number(form.guestCount),
        estimatedBudget: Number(form.estimatedBudget),
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-surface rounded-2xl premium-shadow w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-8 pb-0">
          <div>
            <h2 className="font-display text-headline-sm text-primary">New Booking</h2>
            <p className="font-body text-body-sm text-on-surface-variant mt-1">Fill in the event details below</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition text-on-surface-variant"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <p className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body text-body-sm">
              {error}
            </p>
          )}

          {/* Client Info */}
          <fieldset>
            <legend className="font-body text-label-caps uppercase text-on-surface-variant tracking-widest mb-4">
              Client Info
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Full Name *",  key: "clientName",  type: "text",  required: true },
                { label: "Email *",      key: "clientEmail", type: "email", required: true },
                { label: "Phone *",      key: "clientPhone", type: "text",  required: true },
              ].map(({ label, key, type, required }) => (
                <div key={key}>
                  <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">
                    {label}
                  </label>
                  <input
                    required={required}
                    type={type}
                    value={form[key]}
                    onChange={(e) => set(key, e.target.value)}
                    className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition"
                  />
                </div>
              ))}
            </div>
          </fieldset>

          {/* Event Details */}
          <fieldset>
            <legend className="font-body text-label-caps uppercase text-on-surface-variant tracking-widest mb-4">
              Event Details
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Event Type */}
              <div>
                <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">
                  Event Type *
                </label>
                <select
                  required
                  value={form.eventType}
                  onChange={(e) => set("eventType", e.target.value)}
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition"
                >
                  <option value="">Select type</option>
                  {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Package */}
              <div>
                <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">
                  Package
                </label>
                <select
                  value={form.packageType}
                  onChange={(e) => set("packageType", e.target.value)}
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition"
                >
                  {PACKAGES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">
                  Event Date *
                </label>
                <input
                  required type="date"
                  value={form.eventDate}
                  onChange={(e) => set("eventDate", e.target.value)}
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition"
                />
              </div>

              {/* Time */}
              <div>
                <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">
                  Event Time *
                </label>
                <input
                  required type="time"
                  value={form.eventTime}
                  onChange={(e) => set("eventTime", e.target.value)}
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition"
                />
              </div>

              {/* Venue */}
              <div>
                <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">
                  Venue *
                </label>
                <input
                  required
                  value={form.venue}
                  onChange={(e) => set("venue", e.target.value)}
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition"
                />
              </div>

              {/* Guest Count */}
              <div>
                <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">
                  Guest Count *
                </label>
                <input
                  required type="number" min="1"
                  value={form.guestCount}
                  onChange={(e) => set("guestCount", e.target.value)}
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition"
                />
              </div>

              {/* Budget */}
              <div>
                <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">
                  Estimated Budget (₹)
                </label>
                <input
                  type="number" min="0"
                  value={form.estimatedBudget}
                  onChange={(e) => set("estimatedBudget", e.target.value)}
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition"
                />
              </div>
            </div>
          </fieldset>

          {/* Special Requests */}
          <div>
            <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">
              Special Requests
            </label>
            <textarea
              rows={3}
              value={form.specialRequests}
              onChange={(e) => set("specialRequests", e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body text-body-sm focus:outline-none focus:border-secondary transition resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 border border-outline-variant text-on-surface-variant py-3 rounded-full font-body text-label-caps uppercase hover:border-secondary transition"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading}
              className="flex-1 bg-secondary text-on-primary py-3 rounded-full font-body text-label-caps uppercase disabled:opacity-60 transition"
            >
              {loading ? "Saving…" : "Create Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════════════════ */
export default function ManageBookings() {
  const [activeFilter,  setActiveFilter]  = useState("All");
  const [showModal,     setShowModal]     = useState(false);
  const { bookings, loading, refresh }    = useBookings(activeFilter);

  const handleStatusChange = async (id, status) => {
    await updateBooking(id, { status });
    refresh();
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-surface p-8 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <h1 className="font-display text-headline-md text-primary">Manage Bookings</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-secondary text-on-primary px-6 py-3 rounded-full font-body text-label-caps uppercase hover:opacity-90 transition"
          >
            + New Booking
          </button>
        </header>

        {/* Filter tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveFilter(t)}
              className={`px-4 py-2 rounded-full border font-body text-label-caps uppercase transition ${
                activeFilter === t
                  ? "border-secondary text-secondary"
                  : "border-outline-variant text-on-surface-variant hover:border-secondary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading
          ? <p className="font-body text-body-sm text-on-surface-variant">Loading…</p>
          : <BookingTable rows={bookings} onStatusChange={handleStatusChange} />}
      </main>

      {showModal && (
        <NewBookingModal
          onClose={() => setShowModal(false)}
          onSuccess={refresh}
        />
      )}
    </div>
  );
}