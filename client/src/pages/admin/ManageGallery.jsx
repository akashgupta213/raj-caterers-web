import { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { fetchGallery, deleteGalleryImage } from "../../utils/api";

export default function ManageGallery() {
  const [images,  setImages]  = useState([]);
  const [loading, setLoading] = useState(true);

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
          <button className="bg-secondary text-on-primary px-6 py-3 rounded-full font-body text-label-caps uppercase">+ Upload Images</button>
        </header>
        {loading ? (
          <p className="font-body text-body-sm text-on-surface-variant">Loading...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
            {images.map((img) => (
              <div key={img._id} className="group relative rounded-xl overflow-hidden premium-shadow aspect-square">
                <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                  <button className="text-white"><span className="material-symbols-outlined">edit</span></button>
                  <button onClick={() => handleDelete(img._id)} className="text-white"><span className="material-symbols-outlined">delete</span></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}