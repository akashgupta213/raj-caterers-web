import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/admin/Sidebar";
import api from "../../utils/api";

export default function ManageBanquetHalls() {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", capacityMin: "", capacityMax: "",
    amenities: "", order: "", featured: false,
  });
  const [files, setFiles] = useState([]); // [{ file, preview }]
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const fileRef = useRef();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/banquet-halls/all");
      setHalls(res.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => () => files.forEach((f) => URL.revokeObjectURL(f.preview)), [files]);

  const handleFile = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;
    setFiles((prev) => [...prev, ...picked.map((f) => ({ file: f, preview: URL.createObjectURL(f) }))]);
    e.target.value = "";
  };

  const removeFile = (idx) => setFiles((prev) => {
    const next = [...prev];
    URL.revokeObjectURL(next[idx].preview);
    next.splice(idx, 1);
    return next;
  });

  const clearAllFiles = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
  };

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    setCreating(true);
    setProgress({ done: 0, total: files.length });
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("capacityMin", form.capacityMin || 0);
      fd.append("capacityMax", form.capacityMax || 0);
      fd.append("amenities", form.amenities);
      fd.append("order", form.order || halls.length);
      fd.append("featured", form.featured);
      files.forEach((f) => fd.append("images", f.file));

      await api.post("/banquet-halls", fd, { headers: { "Content-Type": "multipart/form-data" } });

      setForm({ name: "", description: "", capacityMin: "", capacityMax: "", amenities: "", order: "", featured: false });
      clearAllFiles();
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch (e) { console.error(e); }
    finally { setCreating(false); setProgress({ done: 0, total: 0 }); }
  };

  const handleDeleteHall = async (id, name) => {
    if (!window.confirm(`Delete "${name}" and all its photos permanently?`)) return;
    try { await api.delete(`/banquet-halls/${id}`); load(); } catch (e) { console.error(e); }
  };

  const handleToggleActive = async (hall) => {
    try { await api.put(`/banquet-halls/${hall._id}`, { isActive: !hall.isActive }); load(); }
    catch (e) { console.error(e); }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 bg-surface p-4 md:p-8 min-h-screen overflow-x-hidden">
        <h1 className="font-display text-headline-md text-primary mb-2">Manage Banquet Halls</h1>
        <p className="font-body text-body-sm text-on-surface-variant mb-8">
          Add banquet halls with multiple photos — they appear live on the Banquet Halls page instantly.
        </p>

        {/* Create card */}
        <div className="bg-surface-container-lowest rounded-2xl premium-shadow p-6 mb-8">
          <h2 className="font-display text-title-lg text-primary mb-4">Add a New Hall</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Image picker */}
            <div className="md:col-span-1">
              <div
                onClick={() => fileRef.current?.click()}
                className="aspect-video rounded-xl border-2 border-dashed border-outline-variant flex items-center justify-center cursor-pointer hover:border-secondary transition overflow-hidden"
              >
                <div className="text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[40px]">add_photo_alternate</span>
                  <p className="font-body text-body-sm mt-2">Click to select photos</p>
                  <p className="font-body text-[10px] mt-1 text-on-surface-variant/60">You can select multiple images</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFile} />
              </div>

              {files.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant">
                      {files.length} photo{files.length !== 1 ? "s" : ""} selected
                    </p>
                    <button onClick={clearAllFiles} className="font-body text-[11px] text-red-500 hover:underline">Clear all</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                    {files.map((f, idx) => (
                      <div key={idx} className="relative group/thumb rounded-lg overflow-hidden border border-outline-variant aspect-square">
                        <img src={f.preview} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeFile(idx)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition"
                        >
                          <span className="material-symbols-outlined text-[12px]">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fields */}
            <div className="flex flex-col gap-4 md:col-span-2">
              <div>
                <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant block mb-1">Hall Name</label>
                <input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. The Grand Atrium"
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
              </div>
              <div>
                <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant block mb-1">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Short description shown on the detail page"
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant block mb-1">Min Capacity</label>
                  <input type="number" min="0" value={form.capacityMin} onChange={(e) => setForm(f => ({ ...f, capacityMin: e.target.value }))}
                    className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
                </div>
                <div>
                  <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant block mb-1">Max Capacity</label>
                  <input type="number" min="0" value={form.capacityMax} onChange={(e) => setForm(f => ({ ...f, capacityMax: e.target.value }))}
                    className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
                </div>
              </div>
              <div>
                <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant block mb-1">
                  Amenities <span className="normal-case text-on-surface-variant/60">(comma separated)</span>
                </label>
                <input value={form.amenities} onChange={(e) => setForm(f => ({ ...f, amenities: e.target.value }))}
                  placeholder="Bridal Suite, AV System, Valet Parking"
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
              </div>
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant block mb-1">Order</label>
                  <input type="number" min="0" value={form.order} onChange={(e) => setForm(f => ({ ...f, order: e.target.value }))}
                    placeholder={`Auto (${halls.length})`}
                    className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
                </div>
                <label className="flex items-center gap-2 font-body text-body-sm text-on-surface-variant cursor-pointer select-none">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm(f => ({ ...f, featured: e.target.checked }))} />
                  Mark as Premium
                </label>
              </div>
              <button
                onClick={handleCreate}
                disabled={!form.name.trim() || creating}
                className="mt-auto bg-secondary text-on-primary px-6 py-3 rounded-full font-body text-[11px] uppercase tracking-wider disabled:opacity-50 hover:opacity-90 transition flex items-center gap-2"
              >
                {creating ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    Creating… {progress.total ? `(${files.length} photos)` : ""}
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">add_business</span>
                    Create Banquet Hall
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Halls list */}
        <h2 className="font-display text-title-lg text-primary mb-4">
          Halls — {halls.length} total
        </h2>

        {loading ? (
          <p className="font-body text-body-sm text-on-surface-variant">Loading…</p>
        ) : halls.length === 0 ? (
          <div className="text-center py-16 text-on-surface-variant font-body text-body-sm border-2 border-dashed border-outline-variant rounded-xl">
            No banquet halls yet. Add one above.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {halls.map((hall) => (
              <HallCard key={hall._id} hall={hall} onChanged={load} onDelete={handleDeleteHall} onToggle={handleToggleActive} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function HallCard({ hall, onChanged, onDelete, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [edit, setEdit] = useState({
    name: hall.name, description: hall.description || "",
    capacityMin: hall.capacityMin, capacityMax: hall.capacityMax,
    amenities: (hall.amenities || []).join(", "), order: hall.order,
  });
  const [newFiles, setNewFiles] = useState([]); // [{ file, preview }]
  const [uploadingMore, setUploadingMore] = useState(false);
  const addFileRef = useRef();

  useEffect(() => () => newFiles.forEach((f) => URL.revokeObjectURL(f.preview)), [newFiles]);

  const handleAddFiles = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;
    setNewFiles((prev) => [...prev, ...picked.map((f) => ({ file: f, preview: URL.createObjectURL(f) }))]);
    e.target.value = "";
  };

  const handleUploadMore = async () => {
    if (!newFiles.length) return;
    setUploadingMore(true);
    try {
      const fd = new FormData();
      newFiles.forEach((f) => fd.append("images", f.file));
      await api.post(`/banquet-halls/${hall._id}/images`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      newFiles.forEach((f) => URL.revokeObjectURL(f.preview));
      setNewFiles([]);
      if (addFileRef.current) addFileRef.current.value = "";
      onChanged();
    } catch (e) { console.error(e); }
    finally { setUploadingMore(false); }
  };

  const handleDeleteImage = async (publicId) => {
    if (!window.confirm("Remove this photo?")) return;
    try {
      await api.delete(`/banquet-halls/${hall._id}/images`, { data: { publicId } });
      onChanged();
    } catch (e) { console.error(e); }
  };

  const handleSaveEdit = async () => {
    setSaving(true);
    try {
      await api.put(`/banquet-halls/${hall._id}`, edit);
      setEditMode(false);
      onChanged();
    } catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className={`bg-surface-container-lowest rounded-2xl premium-shadow overflow-hidden ${!hall.isActive ? "opacity-60" : ""}`}>
      <div className="flex gap-4 p-4">
        <div className="w-28 h-24 shrink-0 rounded-lg overflow-hidden bg-surface-container-high">
          {hall.images?.[0]?.url ? (
            <img src={hall.images[0].url} alt={hall.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined">image</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {editMode ? (
            <div className="space-y-2">
              <input value={edit.name} onChange={(e) => setEdit(f => ({ ...f, name: e.target.value }))}
                className="w-full bg-transparent border-b border-outline py-1 font-body text-body-sm focus:outline-none focus:border-secondary" />
              <textarea rows={2} value={edit.description} onChange={(e) => setEdit(f => ({ ...f, description: e.target.value }))}
                className="w-full bg-transparent border-b border-outline py-1 font-body text-[12px] focus:outline-none focus:border-secondary resize-none" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" value={edit.capacityMin} onChange={(e) => setEdit(f => ({ ...f, capacityMin: e.target.value }))}
                  placeholder="Min pax" className="bg-transparent border-b border-outline py-1 font-body text-[12px] focus:outline-none focus:border-secondary" />
                <input type="number" value={edit.capacityMax} onChange={(e) => setEdit(f => ({ ...f, capacityMax: e.target.value }))}
                  placeholder="Max pax" className="bg-transparent border-b border-outline py-1 font-body text-[12px] focus:outline-none focus:border-secondary" />
              </div>
              <input value={edit.amenities} onChange={(e) => setEdit(f => ({ ...f, amenities: e.target.value }))}
                placeholder="Amenities, comma separated"
                className="w-full bg-transparent border-b border-outline py-1 font-body text-[12px] focus:outline-none focus:border-secondary" />
              <div className="flex gap-2 pt-1">
                <button onClick={handleSaveEdit} disabled={saving}
                  className="bg-secondary text-on-primary px-4 py-1.5 rounded-full font-body text-[10px] uppercase tracking-wider disabled:opacity-50">
                  {saving ? "Saving…" : "Save"}
                </button>
                <button onClick={() => setEditMode(false)}
                  className="border border-outline-variant px-4 py-1.5 rounded-full font-body text-[10px] uppercase tracking-wider">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-body text-title-lg text-on-surface truncate">{hall.name}</h3>
                {hall.featured && (
                  <span className="shrink-0 bg-secondary text-on-primary px-2 py-0.5 rounded-full font-body text-[9px] uppercase tracking-wider">Premium</span>
                )}
              </div>
              <p className="font-body text-[12px] text-on-surface-variant mt-1">
                {hall.capacityMin || hall.capacityMax
                  ? `${hall.capacityMin || 0} - ${hall.capacityMax || 0} Pax`
                  : "Capacity not set"} · {hall.images?.length || 0} photo{hall.images?.length !== 1 ? "s" : ""}
              </p>
              {hall.amenities?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {hall.amenities.slice(0, 3).map((a) => (
                    <span key={a} className="bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full font-body text-[9px] uppercase tracking-wider">{a}</span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {!editMode && (
        <div className="flex items-center gap-1 px-4 pb-3 flex-wrap">
          <button onClick={() => setExpanded(x => !x)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full font-body text-[10px] uppercase tracking-wider border border-outline-variant hover:border-secondary transition">
            <span className="material-symbols-outlined text-[14px]">{expanded ? "expand_less" : "photo_library"}</span>
            {expanded ? "Hide Photos" : "Manage Photos"}
          </button>
          <button onClick={() => setEditMode(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full font-body text-[10px] uppercase tracking-wider border border-outline-variant hover:border-secondary transition">
            <span className="material-symbols-outlined text-[14px]">edit</span>
            Edit
          </button>
          <button onClick={() => onToggle(hall)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full font-body text-[10px] uppercase tracking-wider border border-outline-variant hover:border-secondary transition">
            <span className="material-symbols-outlined text-[14px]">{hall.isActive ? "visibility_off" : "visibility"}</span>
            {hall.isActive ? "Hide" : "Show"}
          </button>
          <button onClick={() => onDelete(hall._id, hall.name)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full font-body text-[10px] uppercase tracking-wider border border-red-200 text-red-500 hover:bg-red-50 transition ml-auto">
            <span className="material-symbols-outlined text-[14px]">delete</span>
            Delete
          </button>
        </div>
      )}

      {expanded && (
        <div className="border-t border-outline-variant/30 p-4 bg-surface">
          {hall.images?.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-4">
              {hall.images.map((img) => (
                <div key={img.publicId} className="relative group/img aspect-square rounded-lg overflow-hidden border border-outline-variant">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => handleDeleteImage(img.publicId)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition">
                    <span className="material-symbols-outlined text-[12px]">close</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div
            onClick={() => addFileRef.current?.click()}
            className="border-2 border-dashed border-outline-variant rounded-lg p-3 flex items-center gap-2 cursor-pointer hover:border-secondary transition"
          >
            <span className="material-symbols-outlined text-secondary">add_photo_alternate</span>
            <span className="font-body text-[12px] text-on-surface-variant">Click to add more photos</span>
            <input ref={addFileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleAddFiles} />
          </div>

          {newFiles.length > 0 && (
            <div className="mt-3">
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-3">
                {newFiles.map((f, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-outline-variant">
                    <img src={f.preview} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <button onClick={handleUploadMore} disabled={uploadingMore}
                className="bg-secondary text-on-primary px-4 py-2 rounded-full font-body text-[10px] uppercase tracking-wider disabled:opacity-50 flex items-center gap-2">
                {uploadingMore ? (
                  <><span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>Uploading {newFiles.length}…</>
                ) : (
                  <><span className="material-symbols-outlined text-[14px]">cloud_upload</span>Upload {newFiles.length} photo{newFiles.length !== 1 ? "s" : ""}</>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}