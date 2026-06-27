export default function Lightbox({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="relative max-w-4xl w-full p-6">
        <button className="absolute top-2 right-4 text-white text-3xl" onClick={onClose}>×</button>
        <div className="aspect-video image-placeholder rounded-xl">text here</div>
      </div>
    </div>
  );
}
