import { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import api, { fetchMenuItems, deleteMenuItem } from "../../utils/api";

const CATEGORIES   = ["Starters", "Main Course", "Breads", "Rice & Biryani", "Desserts", "Beverages", "Live Counter", "Salads"];
const CUISINES     = ["North Indian", "South Indian", "Continental", "Chinese", "Mughlai", "Multi-Cuisine"];
const DIETARY_TAGS = ["Veg", "Non-Veg", "Vegan", "Jain", "Gluten-Free", "Contains Nuts", "Dairy-Free"];

/* ═══════════════════════════════════════════════════════════════════════════
   CONFIRM DIALOG
═══════════════════════════════════════════════════════════════════════════ */
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-surface rounded-2xl premium-shadow p-8 w-full max-w-sm text-center">
        <span className="material-symbols-outlined text-4xl text-error mb-4 block">warning</span>
        <h3 className="font-display text-title-lg text-primary mb-2">Are you sure?</h3>
        <p className="font-body text-body-sm text-on-surface-variant mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-outline-variant text-on-surface-variant py-3 rounded-full font-body text-label-caps uppercase hover:border-secondary transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-error text-white py-3 rounded-full font-body text-label-caps uppercase transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ADD / EDIT DISH MODAL
═══════════════════════════════════════════════════════════════════════════ */
function DishModal({ item, onClose, onSuccess }) {
  const isEdit = Boolean(item);

  const [form, setForm] = useState({
    name:          item?.name          || "",
    description:   item?.description   || "",
    category:      item?.category      || "",
    cuisine:       item?.cuisine       || "North Indian",
    pricePerPlate: item?.pricePerPlate || "",
    dietaryTags:   item?.dietaryTags   || [],
    isAvailable:   item?.isAvailable   ?? true,
    isFeatured:    item?.isFeatured    ?? false,
  });
  const [image,   setImage]   = useState(null);
  const [preview, setPreview] = useState(item?.imageUrl || null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const toggleTag = (tag) =>
    setForm((f) => ({
      ...f,
      dietaryTags: f.dietaryTags.includes(tag)
        ? f.dietaryTags.filter((t) => t !== tag)
        : [...f.dietaryTags, tag],
    }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "dietaryTags") fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      if (image) fd.append("image", image);

      if (isEdit) {
        await api.put(`/menu/${item._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/menu", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
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
      <div className="relative bg-surface rounded-2xl premium-shadow w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-8 pb-0">
          <div>
            <h2 className="font-display text-headline-sm text-primary">{isEdit ? "Edit Dish" : "Add Dish"}</h2>
            <p className="font-body text-body-sm text-on-surface-variant mt-1">
              {isEdit ? "Update the dish details" : "Add a new item to the menu"}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition text-on-surface-variant">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {error && (
            <p className="bg-error-container text-on-error-container px-4 py-3 rounded-lg font-body text-body-sm">{error}</p>
          )}

          {/* Image */}
          <div>
            <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-2">Dish Image</label>
            <label
              className={`block cursor-pointer rounded-xl border-2 border-dashed transition ${preview ? "border-secondary" : "border-outline-variant hover:border-secondary"}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <div className="h-44 flex flex-col items-center justify-center overflow-hidden rounded-xl">
                {preview ? (
                  <img src={preview} alt="preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <div className="text-center text-on-surface-variant px-4">
                    <span className="material-symbols-outlined text-5xl block mb-2 opacity-60">add_photo_alternate</span>
                    <p className="font-body text-body-sm font-medium">Click to upload or drag & drop</p>
                    <p className="font-body text-[11px] text-on-surface-variant/60 mt-1">PNG, JPG, WEBP — max 5 MB</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
            {preview && (
              <div className="flex gap-3 mt-2">
                <label className="cursor-pointer font-body text-[11px] text-secondary hover:underline">
                  Change image<input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </label>
                <button type="button" onClick={() => { setImage(null); setPreview(null); }} className="font-body text-[11px] text-error hover:underline">Remove</button>
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">Dish Name *</label>
            <input required value={form.name} onChange={(e) => set("name", e.target.value)}
              className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
          </div>

          {/* Category + Cuisine */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">Category *</label>
              <select required value={form.category} onChange={(e) => set("category", e.target.value)}
                className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition">
                <option value="">Select</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">Cuisine</label>
              <select value={form.cuisine} onChange={(e) => set("cuisine", e.target.value)}
                className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition">
                {CUISINES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">Price Per Plate (₹)</label>
            <input type="number" min="0" value={form.pricePerPlate} onChange={(e) => set("pricePerPlate", e.target.value)}
              className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
          </div>

          {/* Description */}
          <div>
            <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-1">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => set("description", e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-3 font-body text-body-sm focus:outline-none focus:border-secondary transition resize-none" />
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="font-body text-label-caps uppercase text-on-surface-variant text-[11px] block mb-2">Dietary Tags</label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_TAGS.map((tag) => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase border transition ${
                    form.dietaryTags.includes(tag)
                      ? "bg-secondary text-on-primary border-secondary"
                      : "border-outline-variant text-on-surface-variant hover:border-secondary"
                  }`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            {[["isAvailable", "Available"], ["isFeatured", "Featured"]].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <div onClick={() => set(key, !form[key])}
                  className={`w-10 h-6 rounded-full transition relative ${form[key] ? "bg-secondary" : "bg-outline-variant"}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form[key] ? "left-5" : "left-1"}`} />
                </div>
                <span className="font-body text-body-sm text-on-surface-variant">{label}</span>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-outline-variant text-on-surface-variant py-3 rounded-full font-body text-label-caps uppercase hover:border-secondary transition">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-secondary text-on-primary py-3 rounded-full font-body text-label-caps uppercase disabled:opacity-60 transition">
              {loading ? "Saving…" : isEdit ? "Save Changes" : "Add Dish"}
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
export default function ManageMenu() {
  const [items,      setItems]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showModal,  setShowModal]  = useState(false);
  const [editItem,   setEditItem]   = useState(null);   // item being edited
  const [deleteItem, setDeleteItem] = useState(null);   // item pending delete confirm

  const load = () => {
    setLoading(true);
    fetchMenuItems().then(setItems).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDeleteConfirm = async () => {
    await deleteMenuItem(deleteItem._id);
    setDeleteItem(null);
    load();
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-surface p-8 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <h1 className="font-display text-headline-md text-primary">Manage Menu</h1>
          <button
            onClick={() => { setEditItem(null); setShowModal(true); }}
            className="bg-secondary text-on-primary px-6 py-3 rounded-full font-body text-label-caps uppercase hover:opacity-90 transition"
          >
            + Add Dish
          </button>
        </header>

        {loading ? (
          <p className="font-body text-body-sm text-on-surface-variant">Loading…</p>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden premium-shadow">
            <table className="w-full text-left">
              <thead className="bg-surface-container text-on-surface-variant font-body text-label-caps uppercase">
                <tr>{["Image", "Name", "Category", "Price", ""].map((h) => <th key={h} className="px-6 py-4">{h}</th>)}</tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r._id} className="border-t border-outline-variant text-body-sm">
                    <td className="px-6 py-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden image-placeholder">
                        {r.imageUrl
                          ? <img src={r.imageUrl} alt={r.name} className="w-full h-full object-cover" />
                          : <span className="flex items-center justify-center h-full text-xs text-on-surface-variant">img</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-primary">{r.name}</td>
                    <td className="px-6 py-4">{r.category}</td>
                    <td className="px-6 py-4">₹{r.pricePerPlate ?? "—"}</td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        onClick={() => { setEditItem(r); setShowModal(true); }}
                        className="text-secondary hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteItem(r)}
                        className="text-error hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center font-body text-body-sm text-on-surface-variant">No dishes yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Add / Edit modal */}
      {showModal && (
        <DishModal
          item={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSuccess={load}
        />
      )}

      {/* Custom delete confirm dialog */}
      {deleteItem && (
        <ConfirmDialog
          message={`Delete "${deleteItem.name}" from the menu? This cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteItem(null)}
        />
      )}
    </div>
  );
}