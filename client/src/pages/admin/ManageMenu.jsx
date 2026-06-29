import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/admin/Sidebar";
import api from "../../utils/api";

const CATEGORIES = ["Appetizers", "Main Course", "Desserts", "Beverages", "Live Counters"];
const DIETARY_OPTIONS = ["Vegetarian", "Vegan", "Halal", "Gluten Free"];

const EMPTY_FORM = { name: "", description: "", price: "", category: "Appetizers", dietary: [], order: "" };

export default function ManageMenu() {
  const [items,     setItems]     = useState([]);
  const [category,  setCategory]  = useState("Appetizers");
  const [loading,   setLoading]   = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [editId,    setEditId]    = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [preview,   setPreview]   = useState(null);
  const [file,      setFile]      = useState(null);
  const [showForm,  setShowForm]  = useState(false);
  const fileRef = useRef();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/menu/all");
      setItems(res.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter((i) => i.category === category);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const toggleDietary = (d) => {
    setForm(f => ({
      ...f,
      dietary: f.dietary.includes(d) ? f.dietary.filter(x => x !== d) : [...f.dietary, d]
    }));
  };

  const openNew = () => {
    setEditId(null);
    setForm({ ...EMPTY_FORM, category });
    setFile(null); setPreview(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditId(item._id);
    setForm({
      name: item.name, description: item.description || "",
      price: item.price, category: item.category,
      dietary: item.dietary || [], order: item.order,
    });
    setPreview(item.imageUrl || null);
    setFile(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === "dietary") fd.append(k, JSON.stringify(v));
        else fd.append(k, v);
      });
      if (file) fd.append("image", file);

      if (editId) {
        await api.put(`/menu/${editId}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/menu", fd, { headers: { "Content-Type": "multipart/form-data" } });
      }
      setShowForm(false); setEditId(null);
      setFile(null); setPreview(null);
      load();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;
    await api.delete(`/menu/${id}`);
    load();
  };

  const handleToggle = async (item) => {
    await api.put(`/menu/${item._id}`, { isActive: !item.isActive });
    load();
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-surface p-8 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-headline-md text-primary">Manage Menu</h1>
            <p className="font-body text-body-sm text-on-surface-variant mt-1">
              Items appear on the public menu page with images.
            </p>
          </div>
          <button onClick={openNew}
            className="bg-secondary text-on-primary px-6 py-3 rounded-full font-body text-[11px] uppercase tracking-wider hover:opacity-90 transition">
            + Add Dish
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-full border font-body text-[11px] uppercase tracking-wider transition ${
                category === c
                  ? "bg-secondary text-on-primary border-secondary"
                  : "border-outline-variant text-on-surface-variant hover:border-secondary"
              }`}>
              {c}
            </button>
          ))}
        </div>

        {/* Items grid */}
        {loading
          ? <p className="font-body text-body-sm text-on-surface-variant">Loading…</p>
          : filtered.length === 0
            ? <div className="text-center py-16 text-on-surface-variant font-body text-body-sm border-2 border-dashed border-outline-variant rounded-xl">
                No items in {category} yet. Click "+ Add Dish" to add one.
              </div>
            : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((item) => (
                  <div key={item._id} className={`bg-surface-container-lowest rounded-xl overflow-hidden border premium-shadow ${!item.isActive ? "opacity-60" : ""}`}>
                    <div className="aspect-video bg-surface-container relative">
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30">
                            <span className="material-symbols-outlined text-[48px]">restaurant</span>
                          </div>
                      }
                      {!item.isActive && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Hidden</div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-display text-title-sm text-primary">{item.name}</h3>
                        <span className="font-body text-body-sm text-secondary font-semibold">₹{item.price}</span>
                      </div>
                      {item.description && <p className="font-body text-body-sm text-on-surface-variant mb-2">{item.description}</p>}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {(item.dietary || []).map((d) => (
                          <span key={d} className="text-[10px] font-bold uppercase bg-surface-container px-2 py-0.5 rounded-full text-on-surface-variant">{d}</span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(item)}
                          className="flex-1 border border-outline-variant text-on-surface-variant py-1.5 rounded-full font-body text-[11px] uppercase hover:border-secondary hover:text-secondary transition">
                          Edit
                        </button>
                        <button onClick={() => handleToggle(item)}
                          className="px-3 py-1.5 rounded-full border border-outline-variant text-on-surface-variant font-body text-[11px] hover:border-secondary transition">
                          <span className="material-symbols-outlined text-[14px]">{item.isActive ? "visibility_off" : "visibility"}</span>
                        </button>
                        <button onClick={() => handleDelete(item._id)}
                          className="px-3 py-1.5 rounded-full border border-red-200 text-red-500 font-body text-[11px] hover:bg-red-50 transition">
                          <span className="material-symbols-outlined text-[14px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
        }
      </main>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-surface rounded-2xl premium-shadow w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-outline-variant">
              <h2 className="font-display text-headline-sm text-primary">{editId ? "Edit Dish" : "Add New Dish"}</h2>
              <button onClick={() => setShowForm(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Image */}
              <div>
                <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant block mb-2">Dish Image</label>
                <div onClick={() => fileRef.current?.click()}
                  className="aspect-video rounded-xl border-2 border-dashed border-outline-variant flex items-center justify-center cursor-pointer hover:border-secondary transition overflow-hidden">
                  {preview
                    ? <img src={preview} alt="" className="w-full h-full object-cover" />
                    : <div className="text-center text-on-surface-variant">
                        <span className="material-symbols-outlined text-[36px]">add_photo_alternate</span>
                        <p className="font-body text-body-sm mt-1">Click to select</p>
                      </div>
                  }
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant block mb-1">Dish Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
              </div>

              {/* Description */}
              <div>
                <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant block mb-1">Description</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
              </div>

              {/* Price + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant block mb-1">Price (₹) *</label>
                  <input type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
                </div>
                <div>
                  <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant block mb-1">Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Dietary */}
              <div>
                <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant block mb-2">Dietary Tags</label>
                <div className="flex flex-wrap gap-2">
                  {DIETARY_OPTIONS.map(d => (
                    <button key={d} type="button" onClick={() => toggleDietary(d)}
                      className={`px-3 py-1.5 rounded-full border font-body text-[11px] uppercase tracking-wider transition ${
                        form.dietary.includes(d)
                          ? "bg-secondary text-on-primary border-secondary"
                          : "border-outline-variant text-on-surface-variant hover:border-secondary"
                      }`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order */}
              <div>
                <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant block mb-1">Display Order</label>
                <input type="number" min="0" value={form.order} onChange={e => setForm(f => ({ ...f, order: e.target.value }))}
                  placeholder="0 = first"
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-outline-variant text-on-surface-variant py-3 rounded-full font-body text-[11px] uppercase hover:border-secondary transition">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving || !form.name || !form.price}
                  className="flex-1 bg-secondary text-on-primary py-3 rounded-full font-body text-[11px] uppercase disabled:opacity-50 hover:opacity-90 transition">
                  {saving ? "Saving…" : editId ? "Save Changes" : "Add Dish"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}