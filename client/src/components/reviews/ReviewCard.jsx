import StarRating from "./StarRating";
export default function ReviewCard({ name, event, rating, text }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-8 premium-shadow">
      <StarRating value={rating} />
      <p className="font-body text-body-lg italic text-on-surface mt-4 mb-6">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full image-placeholder">txt</div>
        <div>
          <p className="font-body text-label-caps uppercase text-secondary">{name}</p>
          <p className="font-body text-body-sm text-on-surface-variant">{event}</p>
        </div>
      </div>
    </div>
  );
}
