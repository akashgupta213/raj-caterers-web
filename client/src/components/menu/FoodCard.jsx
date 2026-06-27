import DietaryBadge from "./DietaryBadge";
export default function FoodCard({ name, desc, price, tags = [] }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl premium-shadow overflow-hidden">
      <div className="h-48 image-placeholder">text here</div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display text-title-lg text-primary">{name}</h3>
          {price && <span className="font-body text-label-caps text-secondary">{price}</span>}
        </div>
        <p className="font-body text-body-sm text-on-surface-variant mb-4">{desc}</p>
        <div className="flex flex-wrap gap-2">{tags.map(t => <DietaryBadge key={t} label={t} />)}</div>
      </div>
    </div>
  );
}
