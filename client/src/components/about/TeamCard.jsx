export default function TeamCard({ name, role, imageUrl }) {
  return (
    <div className="text-center">
      <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-4">
        {imageUrl
          ? <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
          : <div className="w-full h-full image-placeholder flex items-center justify-center text-on-surface-variant/30 text-[11px]">
              No photo
            </div>
        }
      </div>
      <h4 className="font-display text-title-lg text-primary">{name}</h4>
      <p className="font-body text-label-caps uppercase text-secondary tracking-widest mt-1">{role}</p>
    </div>
  );
}