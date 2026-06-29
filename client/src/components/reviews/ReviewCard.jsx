import StarRating from "./StarRating";
import api from "../../utils/api";
import { useState } from "react";

// Deterministic color from name — same name always gets same color
function getAvatarColor(name = "") {
  const colors = [
    ["#7C3AED", "#EDE9FE"], // violet
    ["#B45309", "#FEF3C7"], // amber
    ["#065F46", "#D1FAE5"], // emerald
    ["#1D4ED8", "#DBEAFE"], // blue
    ["#9D174D", "#FCE7F3"], // pink
    ["#92400E", "#FEF3C7"], // orange
    ["#1E40AF", "#DBEAFE"], // indigo
    ["#065F46", "#ECFDF5"], // green
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .map(w => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

export default function ReviewCard({
  id,
  name,
  event,
  rating,
  text,
  isVerified = false,
  helpfulCount = 0,
  avatarUrl = null,
}) {
  const [helpful, setHelpful]       = useState(helpfulCount);
  const [voted,   setVoted]         = useState(false);
  const [loading, setLoading]       = useState(false);

  const [fg, bg] = getAvatarColor(name);
  const initials  = getInitials(name);

  const handleHelpful = async () => {
    if (voted || loading) return;
    setLoading(true);
    try {
      await api.put(`/reviews/${id}/helpful`);
      setHelpful(h => h + 1);
      setVoted(true);
    } catch {
      // silently fail — still optimistic-update locally
      setHelpful(h => h + 1);
      setVoted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-xl p-8 premium-shadow flex flex-col gap-4">
      {/* Stars + verified */}
      <div className="flex items-center justify-between">
        <StarRating value={rating} />
        {isVerified && (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-tertiary-container text-on-tertiary-container font-body text-[10px] uppercase tracking-widest">
            <span className="material-symbols-outlined text-[12px]">verified</span>
            Verified Guest
          </span>
        )}
      </div>

      {/* Review text */}
      <p className="font-body text-body-lg italic text-on-surface flex-1">"{text}"</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        {/* Avatar + name */}
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              className="w-11 h-11 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center font-body font-bold text-sm select-none shrink-0"
              style={{ backgroundColor: bg, color: fg }}
            >
              {initials}
            </div>
          )}
          <div>
            <p className="font-body text-label-caps uppercase tracking-widest text-secondary leading-tight">
              {name}
            </p>
            {event && (
              <p className="font-body text-body-sm text-on-surface-variant">{event}</p>
            )}
          </div>
        </div>

        {/* Helpful button */}
        {id && (
          <button
            onClick={handleHelpful}
            disabled={voted || loading}
            title={voted ? "Thanks for your feedback!" : "Mark as helpful"}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all font-body text-[11px] uppercase tracking-widest
              ${voted
                ? "border-secondary bg-secondary-container text-on-secondary-container cursor-default"
                : "border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary"
              }`}
          >
            <span className="material-symbols-outlined text-[14px]">thumb_up</span>
            {helpful > 0 ? helpful : "Helpful"}
          </button>
        )}
      </div>
    </div>
  );
}