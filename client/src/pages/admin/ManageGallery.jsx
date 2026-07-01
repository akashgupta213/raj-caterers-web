import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/admin/Sidebar";
import api from "../../utils/api";

const SECTIONS = [
  { value: "hero",          label: "Hero Slider" },
  { value: "wedding",       label: "Wedding" },
  { value: "engagement",    label: "Engagement" },
  { value: "birthday",      label: "Birthday" },
  { value: "corporate",     label: "Corporate" },
  { value: "private_dining",label: "Private Dining" },
  { value: "social",        label: "Social" },
  { value: "about",         label: "About / Team" },
  { value: "about_hero",    label: "About Hero Video" },
];

export default function ManageGallery() {
  const [images,    setImages]    = useState([]);
  const [section,   setSection]   = useState("hero");
  const [loading,   setLoading]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form,      setForm]      = useState({ caption: "", order: "" });

  // files is now an array of { file, preview } objects instead of a single file
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const fileRef = useRef();

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/gallery/all");
      setImages(res.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // clean up object URLs when files change/unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, [files]);

  const filtered = images.filter((i) => i.section === section);

  const handleFile = (e) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;
    const withPreviews = picked.map((f) => ({
      file: f,
      preview: URL.createObjectURL(f),
    }));
    setFiles((prev) => [...prev, ...withPreviews]);
    // reset the input so selecting the same file(s) again still fires onChange
    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => {
      const next = [...prev];
      URL.revokeObjectURL(next[index].preview);
      next.splice(index, 1);
      return next;
    });
  };

  const clearAllFiles = () => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
  };

  const handleUpload = async () => {
    if (!files.length) return;
    setUploading(true);
    setProgress({ done: 0, total: files.length });

    const baseOrder = form.order !== "" ? parseInt(form.order, 10) : filtered.length;

    try {
      for (let i = 0; i < files.length; i++) {
        const { file } = files[i];
        const fd = new FormData();
        fd.append("image", file);
        fd.append("section", section);
        fd.append("caption", form.caption);
        // if multiple files share one order value, increment per file so they don't collide
        fd.append("order", baseOrder + i);

        await api.post("/gallery", fd, { headers: { "Content-Type": "multipart/form-data" } });
        setProgress((p) => ({ ...p, done: p.done + 1 }));
      }

      clearAllFiles();
      setForm({ caption: "", order: "" });
      if (fileRef.current) fileRef.current.value = "";
      load();
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
      setProgress({ done: 0, total: 0 });
    }
  };

  const handleDelete = async (id, label) => {
    if (!window.confirm(`Delete this image from ${label}?`)) return;
    await api.delete(`/gallery/${id}`);
    load();
  };

  const handleToggle = async (img) => {
    await api.put(`/gallery/${img._id}`, { isActive: !img.isActive });
    load();
  };

  return (
    <div className="flex flex-col md:flex-row">
  <Sidebar />
  <main className="flex-1 bg-surface p-4 md:p-8 min-h-screen overflow-x-hidden">
        <h1 className="font-display text-headline-md text-primary mb-2">Manage Gallery</h1>
        <p className="font-body text-body-sm text-on-surface-variant mb-8">
          Upload images per section — they appear live on the website instantly.
        </p>

        {/* Section tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {SECTIONS.map((s) => (
            <button key={s.value} onClick={() => setSection(s.value)}
              className={`px-4 py-2 rounded-full border font-body text-[11px] uppercase tracking-wider transition ${
                section === s.value
                  ? "bg-secondary text-on-primary border-secondary"
                  : "border-outline-variant text-on-surface-variant hover:border-secondary"
              }`}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Upload card */}
        <div className="bg-surface-container-lowest rounded-2xl premium-shadow p-6 mb-8">
          <h2 className="font-display text-title-lg text-primary mb-4">
            Upload to: <span className="text-secondary">{SECTIONS.find(s => s.value === section)?.label}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Image picker */}
            <div className="md:col-span-1">
              <div
                onClick={() => fileRef.current?.click()}
                className="aspect-video rounded-xl border-2 border-dashed border-outline-variant flex items-center justify-center cursor-pointer hover:border-secondary transition overflow-hidden"
              >
                <div className="text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[40px]">add_photo_alternate</span>
                  <p className="font-body text-body-sm mt-2">Click to select image(s) or video(s)</p>
                  <p className="font-body text-[10px] mt-1 text-on-surface-variant/60">You can select multiple files</p>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleFile}
                />
              </div>

              {/* Selected files preview strip */}
              {files.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant">
                      {files.length} file{files.length !== 1 ? "s" : ""} selected
                    </p>
                    <button
                      onClick={clearAllFiles}
                      className="font-body text-[11px] text-red-500 hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                    {files.map((f, idx) => (
                      <div key={idx} className="relative group/thumb rounded-lg overflow-hidden border border-outline-variant aspect-square">
                        {f.file.type.startsWith("video/")
                          ? <video src={f.preview} className="w-full h-full object-cover" muted playsInline />
                          : <img src={f.preview} alt="" className="w-full h-full object-cover" />
                        }
                        <button
                          onClick={() => removeFile(idx)}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition"
                          title="Remove"
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
                <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant block mb-1">Caption (optional)</label>
                <input value={form.caption} onChange={(e) => setForm(f => ({ ...f, caption: e.target.value }))}
                  placeholder="e.g. Royal Wedding at The Grand"
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
                {files.length > 1 && (
                  <p className="font-body text-[10px] mt-1 text-on-surface-variant/60">
                    This caption will be applied to all {files.length} files.
                  </p>
                )}
              </div>
              <div>
                <label className="font-body text-[11px] uppercase tracking-widest text-on-surface-variant block mb-1">
                  Order / Position <span className="normal-case text-on-surface-variant/60">(lower = appears first)</span>
                </label>
                <input type="number" min="0" value={form.order} onChange={(e) => setForm(f => ({ ...f, order: e.target.value }))}
                  placeholder={`Auto (${filtered.length})`}
                  className="w-full bg-transparent border-b border-outline py-2 font-body text-body-sm focus:outline-none focus:border-secondary transition" />
                {files.length > 1 && (
                  <p className="font-body text-[10px] mt-1 text-on-surface-variant/60">
                    Files will be ordered sequentially starting from this value.
                  </p>
                )}
              </div>
              <button
                onClick={handleUpload}
                disabled={!files.length || uploading}
                className="mt-auto bg-secondary text-on-primary px-6 py-3 rounded-full font-body text-[11px] uppercase tracking-wider disabled:opacity-50 hover:opacity-90 transition flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">
                      progress_activity
                    </span>
                    Uploading {progress.done}/{progress.total}...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">
                      cloud_upload
                    </span>
                    Upload {files.length > 1 ? `${files.length} Files` : files.length === 1 ? (files[0].file.type.startsWith("video/") ? "Video" : "Image") : "Files"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Images grid */}
        <h2 className="font-display text-title-lg text-primary mb-4">
          {SECTIONS.find(s => s.value === section)?.label} — {filtered.length} image{filtered.length !== 1 ? "s" : ""}
        </h2>

        {loading
          ? <p className="font-body text-body-sm text-on-surface-variant">Loading…</p>
          : filtered.length === 0
            ? <div className="text-center py-16 text-on-surface-variant font-body text-body-sm border-2 border-dashed border-outline-variant rounded-xl">
                No images in this section yet. Upload one above.
              </div>
            : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((img) => (
  <div key={img._id} className={`relative group rounded-xl overflow-hidden border ${img.isActive ? "border-outline-variant" : "border-red-200 opacity-60"}`}>
    
    {img.mediaType === "video"
      ? <video src={img.imageUrl} className="w-full aspect-video object-cover" muted loop playsInline />
      : <img src={img.imageUrl} alt={img.caption} className="w-full aspect-video object-cover" />
    }

    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
      <button onClick={() => handleToggle(img)}
        className="w-9 h-9 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition"
        title={img.isActive ? "Hide" : "Show"}>
        <span className="material-symbols-outlined text-[16px]">{img.isActive ? "visibility_off" : "visibility"}</span>
      </button>
      <button onClick={() => handleDelete(img._id, SECTIONS.find(s => s.value === img.section)?.label)}
        className="w-9 h-9 rounded-full bg-red-500/80 text-white flex items-center justify-center hover:bg-red-600 transition"
        title="Delete">
        <span className="material-symbols-outlined text-[16px]">delete</span>
      </button>
    </div>

    <div className="p-2 bg-surface">
      <p className="font-body text-[11px] text-on-surface-variant truncate">{img.caption || "No caption"}</p>
      <p className="font-body text-[10px] text-on-surface-variant/60">Order: {img.order}</p>
    </div>

  </div>
))}
              </div>
        }
      </main>
    </div>
  );
}