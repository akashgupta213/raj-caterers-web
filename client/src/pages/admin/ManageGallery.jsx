import Sidebar from "../../components/admin/Sidebar";

export default function ManageGallery() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-surface p-8 min-h-screen">
        <header className="flex justify-between items-center mb-8">
          <h1 className="font-display text-headline-md text-primary">Manage Gallery</h1>
          <button className="bg-secondary text-on-primary px-6 py-3 rounded-full font-body text-label-caps uppercase">+ Upload Images</button>
        </header>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="group relative rounded-xl overflow-hidden premium-shadow image-placeholder aspect-square">
              text here
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                <button className="text-white"><span className="material-symbols-outlined">edit</span></button>
                <button className="text-white"><span className="material-symbols-outlined">delete</span></button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
