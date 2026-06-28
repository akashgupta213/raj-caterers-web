import { useState, useEffect, useRef } from "react";
import Sidebar from "../../components/admin/Sidebar";
import api, { fetchGallery, deleteGalleryImage } from "../../utils/api";

/* ═══════════════════════════════════════════════════════════════════════════
   UPLOAD IMAGES MODAL
═══════════════════════════════════════════════════════════════════════════ */
function UploadImagesModal({ onClose, onSuccess }) {
  const [files,   setFiles]   = useState([]);   // [{ file, preview, title, tag }]
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const inputRef = useRef();

  const addFiles = (incoming) => {
    const valid = Array.from(incoming).filter((f) => f.type.startsWith("image/"));
    const entries = valid.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^.]+$/, ""),
      tag: "",
    }));
    setFiles((prev) => [...prev, ...entries]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const removeFile = (idx) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const updateField = (idx, key, val) =>
    setFiles((prev) => prev.map((f, i) => (i === idx ? { ...f, [key]: val } : f)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) { setError("Please select at least one image."); return; }
    setError("");
    setLoading(true);
    try {
      await Promise.all(
        files.map(({ file, title, tag }) => {
          const fd = new FormData();
          fd.append("image", file);
          fd.append("title", title);
          if (tag) fd.append("tag", tag);
          return api.post("/gallery", fd, { headers: { "Content-Type": "multipart/form-data" } });
        })
      );
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
            <h2 className="font-display text-headline-sm text-primary">Upload Images</h2>
            <p className="font-body text-body-sm text-on-surface-variant mt-1">
              Add photos to the gallery
            </p>
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

          {/* Drop zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer rounded-xl border-2 border-dashed border-outline-variant hover:border-secondary transition flex flex-col items-center justify-center gap-2 py-10 text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-5xl opacity-60">add_photo_alternate</span>
            <p className="font-body text-body-sm font-medium">Click to upload or drag & drop</p>
            <p className="font-body text-[11px] opacity-60">PNG, JPG, WEBP — multiple files supported</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          {/* Previews */}
          {files.length > 0 && (
            <div className="space-y-3">
              <p className="font-body text-label-caps uppercase text-on-surface-variant text-[11px]">
                {files.length} image{files.length > 1 ? "s" : ""} selected
              </p>

              {files.map((entry, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 items-start bg-surface-container-lowest border border-outline-variant rounded-xl p-3"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={entry.preview} alt="" className="w-full h-full object-cover" />
                  </div>

                  {/* Fields */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <label className="font-body text-[10px] uppercase text-on-surface-variant tracking-wider block mb-0.5">
                        Title
                      </label>
                      <input
                        value={entry.title}
                        onChange={(e) => updateField(idx, "title", e.target.value)}
                        className="w-full bg-transparent border-b border-outline py-1 font-body text-body-sm focus:outline-none focus:border-secondary transition"
                      />
                    </div>
                    <div>
                      <label className="font-body text-[10px] uppercase text-on-surface-variant tracking-wider block mb-0.5">
                        Tag / Category
                      </label>
                      <input
                        value={entry.tag}
                        placeholder="e.g. Wedding, Food, Venue"
                        onChange={(e) => updateField(idx, "tag", e.target.value)}
                        className="w-full bg-transparent border-b border-outline py-1 font-body text-body-sm focus:outline-none focus:border-secondary transition placeholder:opacity-40"
                      />
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="text-on-surface-variant hover:text-error transition mt-1"
                  >
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button" onClick={onClose}
              className="flex-1 border border-outline-variant text-on-surface-variant py-3 rounded-full font-body text-label-caps uppercase hover:border-secondary transition"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={loading || !files.length}
              className="flex-1 bg-secondary text-on-primary py-3 rounded-full font-body text-label-caps uppercase disabled:opacity-60 transition"
            >
              {loading ? "Uploading…" : `Upload${files.length > 1 ? ` ${files.length} Images` : ""}`}
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
export default function ManageGallery() {
  const [images,    setImages]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);

  const load = () => {
    setLoading(true);
    fetchGallery().then(setImages).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this image?")) return;
    await deleteGalleryImage(id);
    load();
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-surface p-8 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <h1 className="font-display text-headline-md text-primary">Manage Gallery</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-secondary text-on-primary px-6 py-3 rounded-full font-body text-label-caps uppercase hover:opacity-90 transition"
          >
            + Upload Images
          </button>
        </header>

        {loading ? (
          <p className="font-body text-body-sm text-on-surface-variant">Loading…</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {images.map((img) => (
              <div
                key={img._id}
                className="group relative rounded-xl overflow-hidden premium-shadow aspect-square"
              >
                <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                  <button className="text-white">
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button onClick={() => handleDelete(img._id)} className="text-white">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <UploadImagesModal
          onClose={() => setShowModal(false)}
          onSuccess={load}
        />
      )}
    </div>
  );
}