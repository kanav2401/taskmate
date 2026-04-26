import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({ value = 0, onChange, readonly = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hover || value);
        return (
          <button
            key={star}
            type="button"
            className={`p-0.5 rounded-full transition-all focus:outline-none ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'} ${isFilled ? 'text-amber-400 drop-shadow-[0_0_2px_rgba(251,191,36,0.5)]' : 'text-muted-foreground/30'}`}
            onClick={() => !readonly && onChange && onChange(star)}
            onMouseEnter={() => !readonly && setHover(star)}
            onMouseLeave={() => !readonly && setHover(0)}
            disabled={readonly}
          >
            <Star className={`w-6 h-6 ${isFilled ? "fill-current" : ""}`} />
          </button>
        );
      })}
    </div>
  );
}