import { Link } from "react-router-dom";

export default function ServiceCard({
  title,
  desc,
  features = [],
  mediaUrl,
  mediaType,
  gallerySection,
}) {
  return (
    <Link
      to={`/gallery?section=${gallerySection}`}
      className="bg-surface-container-lowest rounded-xl premium-shadow overflow-hidden hover:-translate-y-2 transition block group"
    >
      <div className="h-56 overflow-hidden">
        {mediaUrl ? (
          mediaType === "video" ? (
            <video
              src={mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          ) : (
            <img
              src={mediaUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          )
        ) : (
          <div className="w-full h-full image-placeholder" />
        )}
      </div>

      <div className="p-8">
        <h3 className="font-display text-title-lg text-secondary mb-3">
          {title}
        </h3>

        <p className="font-body text-body-sm text-on-surface-variant mb-6">
          {desc}
        </p>

        <ul className="space-y-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-body-sm">
              <span className="material-symbols-outlined text-secondary text-base mt-0.5">
                check_circle
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}