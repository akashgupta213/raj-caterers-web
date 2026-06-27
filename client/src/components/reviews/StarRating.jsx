export default function StarRating({ value = 5 }) {
  return (
    <div className="flex text-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: i < value ? "'FILL' 1" : "'FILL' 0" }}>star</span>
      ))}
    </div>
  );
}
