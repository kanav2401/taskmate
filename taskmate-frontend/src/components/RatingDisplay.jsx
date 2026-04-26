import { Star, StarHalf } from "lucide-react";

export default function RatingDisplay({ rating = 0, count = 0 }) {
  // Calculate full, half, and empty stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5" title={`${rating.toFixed(1)} stars`}>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
        {hasHalfStar && <StarHalf className="w-4 h-4 fill-amber-400 text-amber-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 fill-transparent text-muted-foreground/30" />
        ))}
      </div>
      <span className="text-sm font-medium text-foreground">
        {rating?.toFixed(1) || "0.0"} <span className="text-muted-foreground font-normal ml-0.5">({count || 0})</span>
      </span>
    </div>
  );
}