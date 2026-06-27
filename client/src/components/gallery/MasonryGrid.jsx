export default function MasonryGrid({ items = [] }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-gutter space-y-gutter">
      {items.map((it, i) => (
        <div key={i} className={`break-inside-avoid rounded-xl overflow-hidden premium-shadow image-placeholder`}
             style={{ height: 200 + ((i % 4) * 60) }}>
          text here
        </div>
      ))}
    </div>
  );
}
