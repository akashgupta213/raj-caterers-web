import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { useBookings } from "../../hooks/useBookings";
import api, { updateBooking } from "../../utils/api";
import { useConfirm } from "../../hooks/useConfirm";
import ConfirmDialog from "../../components/common/ConfirmDialog";

const FILTERS     = ["All", "Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];
const EVENT_TYPES = ["Wedding", "Engagement", "Birthday", "Corporate", "Private Dining", "Social Soiree", "Other"];
const PACKAGES    = ["Basic", "Premium", "Royal", "Custom"];

const FILTER_ACTIVE = {
  "All":         "border-secondary text-secondary",
  "Pending":     "border-amber-400 text-amber-600 bg-amber-50",
  "Confirmed":   "border-emerald-500 text-emerald-700 bg-emerald-50",
  "In Progress": "border-blue-400 text-blue-700 bg-blue-50",
  "Completed":   "border-slate-400 text-slate-700 bg-slate-100",
  "Cancelled":   "border-red-400 text-red-700 bg-red-50",
};

/* Status pill colours (no colour on dropdown, only on pill after selection) */
const STATUS_PILL = {
  "Pending":     "bg-amber-100 text-amber-700",
  "Confirmed":   "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-blue-100 text-blue-700",
  "Completed":   "bg-slate-200 text-slate-700",
  "Cancelled":   "bg-red-100 text-red-600",
};

const fmt = (n) => !n ? "—" : n >= 10000000 ? `₹${(n / 10000000).toFixed(2)}Cr` : n >= 100000 ? `₹${(n / 100000).toFixed(2)}L` : `₹${n.toLocaleString("en-IN")}`;

/* ─── Sort / filter helpers ──────────────────────────────────────────── */
const SORT_FIELDS  = ["name", "date", "amount"];
const SORT_LABELS  = { name: "Name", date: "Date", amount: "Amount" };

/* ══════════════════════════════════════════════════════════════════════════
   BOOKING DRAWER (slide from right)
══════════════════════════════════════════════════════════════════════════ */
function BookingDrawer({ booking, onClose, onUpdated }) {
  const [visible,      setVisible]      = useState(false);
  const [lightbox,     setLightbox]     = useState(null);
  const [totalAmount,  setTotalAmount]  = useState(booking?.totalAmount || "");
  const [confirmedAmt, setConfirmedAmt] = useState(booking?.totalAmount || 0);
  const [saving,       setSaving]       = useState(false);
  const [saved,        setSaved]        = useState(false);

  useEffect(() => {
    if (!booking) return;
    requestAnimationFrame(() => setVisible(true));
  }, [booking]);

  if (!booking) return null;

  const close = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const handleSaveAmount = async () => {
    const amt = Number(totalAmount);
    if (!amt && amt !== 0) return;
    setSaving(true);
    try {
      await updateBooking(booking._id, { totalAmount: amt });
      setConfirmedAmt(amt);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      onUpdated?.();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const images = booking.menuImages || [];

  const fields = [
    ["Client",           booking.clientName],
    ["Email",            booking.clientEmail],
    ["Phone",            booking.clientPhone],
    ["Event Type",       booking.eventType],
    ["Package",          booking.packageType],
    ["Date",             booking.eventDate ? new Date(booking.eventDate).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" }) : "—"],
    ["Time",             booking.eventTime],
    ["Venue",            booking.venue],
    ["Guests",           booking.guestCount],
    ["Client Budget",    booking.estimatedBudget ? fmt(booking.estimatedBudget) : "Not specified"],
    ["Special Requests", booking.specialRequests || "—"],
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={close}
      />

      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-surface shadow-2xl flex flex-col transition-transform duration-300 ease-out ${visible ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant">
          <div>
            <h2 className="font-display text-headline-sm text-primary">Booking Details</h2>
            <p className="font-body text-body-sm text-on-surface-variant mt-0.5">
              #{booking._id?.slice(-6).toUpperCase()}
            </p>
          </div>
          <button onClick={close}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Status */}
        <div className="px-6 pt-5">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${STATUS_PILL[booking.status] || "bg-surface-container text-on-surface"}`}>
            {booking.status}
          </span>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {fields.map(([label, val]) => (
            <div key={label} className="border-b border-outline-variant/40 pb-3">
              <p className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-0.5">{label}</p>
              <p className="font-body text-body-sm text-on-surface">{val ?? "—"}</p>
            </div>
          ))}

          {/* Total Amount — editable */}
          <div className="border-b border-outline-variant/40 pb-3">
            <p className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">
              Total Amount <span className="normal-case text-secondary">(set by admin)</span>
            </p>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-body-sm text-on-surface-variant">₹</span>
                <input
                  type="number"
                  min="0"
                  value={totalAmount}
                  onChange={(e) => { setTotalAmount(e.target.value); setSaved(false); }}
                  placeholder="Enter final amount"
                  className="w-full pl-7 pr-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-xl font-body text-body-sm focus:outline-none focus:border-secondary transition"
                />
              </div>
              <button
                onClick={handleSaveAmount}
                disabled={saving}
                className={`px-4 py-2 rounded-xl font-body text-[11px] uppercase tracking-wider transition flex items-center gap-1.5 ${
                  saved
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                    : "bg-secondary text-on-primary hover:opacity-90 disabled:opacity-50"
                }`}
              >
                {saving ? (
                  <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                ) : saved ? (
                  <><span className="material-symbols-outlined text-[14px]">check</span> Saved</>
                ) : (
                  "Save"
                )}
              </button>
            </div>
            {confirmedAmt > 0 && (
              <p className="font-body text-[11px] text-on-surface-variant mt-1.5">
                Set amount: <span className="text-secondary font-semibold">{fmt(confirmedAmt)}</span>
                <span className="ml-2 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">✓ Saved</span>
              </p>
            )}
          </div>

          {/* Menu Images */}
          {images.length > 0 && (
            <div>
              <p className="font-body text-[10px] uppercase tracking-widest text-on-surface-variant mb-3">Menu Images</p>
              <div className="grid grid-cols-3 gap-2">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightbox(idx)}
                    className="aspect-square rounded-lg overflow-hidden border border-outline-variant hover:border-secondary transition group"
                  >
                    <img src={src} alt={`Menu ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-200" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/80"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            onClick={() => setLightbox(null)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          {lightbox > 0 && (
            <button
              className="absolute left-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox - 1); }}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
          )}
          <img
            src={images[lightbox]}
            alt=""
            className="max-h-[80vh] max-w-[80vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {lightbox < images.length - 1 && (
            <button
              className="absolute right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
              onClick={(e) => { e.stopPropagation(); setLightbox(lightbox + 1); }}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          )}
          <div className="absolute bottom-4 font-body text-white/60 text-[11px]">
            {lightbox + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   NEW BOOKING MODAL
══════════════════════════════════════════════════════════════════════════ */
function NewBookingModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    clientName: "", clientEmail: "", clientPhone: "",
    eventType: "", eventDate: "", eventTime: "", venue: "",
    guestCount: "", packageType: "Custom",
    estimatedBudget: "", specialRequests: "",
  });
  const [menuImages, setMenuImages] = useState([]); // { file, preview }[]
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const fileRef = useRef();

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleFiles = (files) => {
    const picked = Array.from(files).slice(0, 10 - menuImages.length);
    const previews = picked.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setMenuImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (idx) => {
    setMenuImages((prev) => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // TODO: switch to multipart/form-data once multer is set up on the backend
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
        <div className="flex justify-between items-center p-8 pb-0">
          <div>
            <h2 className="font-display text-headline-sm text-primary">New Booking</h2>
            <p className="font-body text-body-sm text-on-surface-variant mt-1">Fill in the event details below</p>
          </div>
          <button onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <p className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body text-body-sm">{error}</p>
          )}

          {/* Client Info */}
          <fieldset>
            <legend className="font-body text-label-caps uppercase text-on-surface-variant tracking-widest mb-4">Client Info</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Full Name *",  key: "clientName",  type: "text",  required: true },
                { label: "Email *",      key: "clientEmail", type: "email", required: true },
                { label: "Phone *",      key: "clientPhone", type: "text",  required: true },
              ].map(({ label, key, type, required }) => (
                <div key={key}>
                  <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">{label}</label>
                  <input required={required} type={type} value={form[key]} onChange={(e) => set(key, e.target.value)}
                    className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
                </div>
              ))}
            </div>
          </fieldset>

          {/* Event Details */}
          <fieldset>
            <legend className="font-body text-label-caps uppercase text-on-surface-variant tracking-widest mb-4">Event Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">Event Type *</label>
                <select required value={form.eventType} onChange={(e) => set("eventType", e.target.value)}
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition">
                  <option value="">Select type</option>
                  {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">Package</label>
                <select value={form.packageType} onChange={(e) => set("packageType", e.target.value)}
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition">
                  {PACKAGES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">Event Date *</label>
                <input required type="date" value={form.eventDate} onChange={(e) => set("eventDate", e.target.value)}
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
              </div>
              <div>
                <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">Event Time *</label>
                <input required type="time" value={form.eventTime} onChange={(e) => set("eventTime", e.target.value)}
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
              </div>
              <div>
                <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">Venue *</label>
                <input required value={form.venue} onChange={(e) => set("venue", e.target.value)}
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
              </div>
              <div>
                <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">Guest Count *</label>
                <input required type="number" min="1" value={form.guestCount} onChange={(e) => set("guestCount", e.target.value)}
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
              </div>
              <div>
                <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">Estimated Budget (₹)</label>
                <input type="number" min="0" value={form.estimatedBudget} onChange={(e) => set("estimatedBudget", e.target.value)}
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
              </div>
            </div>
          </fieldset>

          {/* Special Requests */}
          <div>
            <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">Special Requests</label>
            <textarea rows={3} value={form.specialRequests} onChange={(e) => set("specialRequests", e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body text-body-sm focus:outline-none focus:border-secondary transition resize-none" />
          </div>

          {/* Menu Image Upload */}
          <div>
            <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-3">Menu Images (optional)</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            {menuImages.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mb-3">
                {menuImages.map((img, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-outline-variant">
                    <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 border border-dashed border-outline-variant rounded-xl px-5 py-3 text-on-surface-variant hover:border-secondary hover:text-secondary transition font-body text-body-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
              {menuImages.length > 0 ? `Add more (${menuImages.length} uploaded)` : "Upload menu images"}
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-outline-variant text-on-surface-variant py-3 rounded-full font-body text-label-caps uppercase hover:border-secondary transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-secondary text-on-primary py-3 rounded-full font-body text-label-caps uppercase disabled:opacity-60 transition">
              {loading ? "Saving…" : "Create Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   STATUS DROPDOWN — premium, no colour until selected
══════════════════════════════════════════════════════════════════════════ */
function StatusDropdown({ value, onChange, id }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const STATUSES = ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider transition ${
          STATUS_PILL[value]
            ? `${STATUS_PILL[value]} border-transparent`
            : "border-outline-variant text-on-surface-variant"
        }`}
      >
        {value}
        <span className="material-symbols-outlined text-[13px]">expand_more</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-30 bg-surface rounded-2xl border border-outline-variant shadow-xl overflow-hidden min-w-[160px]">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { onChange(id, s); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 font-body text-body-sm transition hover:bg-surface-container ${
                s === value ? "text-secondary font-semibold" : "text-on-surface"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   BOOKINGS TABLE — cleaned up spacing, alignment, and row rhythm
══════════════════════════════════════════════════════════════════════════ */
function BookingsTable({ rows, onStatusChange, onView, onDelete }) {
  if (!rows.length) {
    return (
      <div className="text-center py-16 text-on-surface-variant font-body text-body-sm border-2 border-dashed border-outline-variant rounded-xl">
        No bookings found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl premium-shadow border border-outline-variant/50">
      <table className="w-full text-left border-collapse min-w-[900px]">
        <thead>
          <tr className="bg-surface-container-lowest">
            {["Client", "Event", "Date", "Guests", "Package", "Amount", "Status", ""].map((h) => (
              <th
                key={h}
                className="px-4 py-3.5 font-body text-[10px] uppercase tracking-widest text-on-surface-variant whitespace-nowrap border-b border-outline-variant"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((b, i) => (
            <tr
              key={b._id}
              className={`transition-colors hover:bg-surface-container-lowest/70 ${
                i !== rows.length - 1 ? "border-b border-outline-variant/30" : ""
              }`}
            >
              <td className="px-4 py-4 align-middle">
                <p className="font-body text-body-sm text-on-surface font-medium leading-tight">{b.clientName}</p>
                <p className="font-body text-[11px] text-on-surface-variant mt-0.5">{b.clientEmail}</p>
              </td>
              <td className="px-4 py-4 align-middle font-body text-body-sm text-on-surface-variant">{b.eventType}</td>
              <td className="px-4 py-4 align-middle font-body text-body-sm text-on-surface-variant whitespace-nowrap">
                {b.eventDate ? new Date(b.eventDate).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—"}
              </td>
              <td className="px-4 py-4 align-middle font-body text-body-sm text-on-surface-variant">{b.guestCount ?? "—"}</td>
              <td className="px-4 py-4 align-middle font-body text-body-sm text-on-surface-variant">{b.packageType}</td>
              <td className="px-4 py-4 align-middle font-body text-body-sm text-on-surface font-medium whitespace-nowrap">
                {b.totalAmount ? fmt(b.totalAmount) : b.estimatedBudget ? fmt(b.estimatedBudget) : "—"}
              </td>
              <td className="px-4 py-4 align-middle">
                <StatusDropdown value={b.status} onChange={onStatusChange} id={b._id} />
              </td>
              <td className="px-4 py-4 align-middle">
                <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                  <button
                    onClick={() => onView(b)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-outline-variant text-[11px] font-body uppercase tracking-wider text-on-surface-variant hover:border-secondary hover:text-secondary hover:bg-secondary/5 transition"
                  >
                    <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                    View
                  </button>
                  <button
                    onClick={() => onDelete(b._id, b.clientName)}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition"
                    title="Delete booking"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function ManageBookings() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [showModal,    setShowModal]    = useState(false);
  const [sortField,    setSortField]    = useState("date");
  const [sortDir,      setSortDir]      = useState("desc");
  const [search,       setSearch]       = useState("");
  const [selected,     setSelected]     = useState(null);

  const { bookings, loading, refresh } = useBookings(activeFilter);
  const { confirm, dialog, handleConfirm, handleCancel } = useConfirm();

  /* ── Sort & search ──────────────────────────────────────────────────── */
  const toggleSort = (field) => {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const processed = [...bookings]
    .filter((b) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        b.clientName?.toLowerCase().includes(q) ||
        b.clientEmail?.toLowerCase().includes(q) ||
        b.clientPhone?.toLowerCase().includes(q) ||
        b.eventType?.toLowerCase().includes(q) ||
        b.venue?.toLowerCase().includes(q) ||
        (b.totalAmount || b.estimatedBudget || 0).toString().includes(q)
      );
    })
    .sort((a, b) => {
      let av, bv;
      if (sortField === "name")   { av = a.clientName ?? ""; bv = b.clientName ?? ""; }
      if (sortField === "date")   { av = new Date(a.eventDate); bv = new Date(b.eventDate); }
      if (sortField === "amount") { av = a.totalAmount || a.estimatedBudget || 0; bv = b.totalAmount || b.estimatedBudget || 0; }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const handleStatusChange = async (id, status) => {
    await updateBooking(id, { status });
    refresh();
  };

  const handleDeleteBooking = async (id, name) => {
    const ok = await confirm(`Delete the booking for "${name}" permanently?`);
    if (!ok) return;
    try {
      await api.delete(`/bookings/${id}`);
      refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
  <Sidebar />
  <main className="flex-1 bg-surface p-4 md:p-8 min-h-screen overflow-x-hidden">

        {/* Header */}
       <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8">
          <div>
            <h1 className="font-display text-headline-md text-primary">Manage Bookings</h1>
            <p className="font-body text-body-sm text-on-surface-variant mt-1">
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
              {activeFilter !== "All" ? ` — ${activeFilter}` : ""}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-secondary text-on-primary px-6 py-3 rounded-full font-body text-label-caps uppercase hover:opacity-90 transition"
          >
            + New Booking
          </button>
        </header>

        {/* Filter tabs + Search + Sort */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Status filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {FILTERS.map((t) => (
              <button
                key={t}
                onClick={() => setActiveFilter(t)}
                className={`px-4 py-2 rounded-full border font-body text-label-caps uppercase transition text-[11px] ${
                  activeFilter === t
                    ? (FILTER_ACTIVE[t] || "border-secondary text-secondary")
                    : "border-outline-variant text-on-surface-variant hover:border-secondary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search + Sort bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, phone, event, venue, amount…"
                className="w-full bg-surface-container-lowest border border-outline-variant rounded-full pl-9 pr-4 py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition"
              />
              {search && (
                <button onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-secondary transition">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            {/* Sort buttons */}
            <div className="flex items-center gap-2">
              <span className="font-body text-[11px] uppercase text-on-surface-variant tracking-widest">Sort</span>
              {SORT_FIELDS.map((f) => (
                <button
                  key={f}
                  onClick={() => toggleSort(f)}
                  className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full border text-[11px] font-body uppercase tracking-wider transition ${
                    sortField === f
                      ? "border-secondary text-secondary bg-secondary/5"
                      : "border-outline-variant text-on-surface-variant hover:border-secondary"
                  }`}
                >
                  {SORT_LABELS[f]}
                  {sortField === f && (
                    <span className="material-symbols-outlined text-[13px]">
                      {sortDir === "asc" ? "arrow_upward" : "arrow_downward"}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        {loading
          ? <p className="font-body text-body-sm text-on-surface-variant">Loading…</p>
          : <BookingsTable rows={processed} onStatusChange={handleStatusChange} onView={setSelected} onDelete={handleDeleteBooking} />}
      </main>

      {showModal && (
        <NewBookingModal onClose={() => setShowModal(false)} onSuccess={refresh} />
      )}

      {selected && (
        <BookingDrawer
          booking={selected}
          onClose={() => setSelected(null)}
          onUpdated={() => { refresh(); }}
        />
      )}

      <ConfirmDialog {...dialog} onConfirm={handleConfirm} onCancel={handleCancel} />
    </div>
  );
}