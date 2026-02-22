export default function RatingDisplay({ rating = 0, count = 0 }) {
  const stars = Math.round(rating);

  return (
    <div className="rating-display">
      <span className="stars">
        {"★".repeat(stars)}
        {"☆".repeat(5 - stars)}
      </span>
      <span className="rating-text">
        {rating?.toFixed(1) || "0.0"} ({count || 0})
      </span>
    </div>
  );
}