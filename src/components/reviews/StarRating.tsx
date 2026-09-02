"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

export default function StarRating({
  rating,
  onRatingChange,
  readOnly = false,
  size = "md",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeRating = hoverRating !== null ? hoverRating : rating;

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= activeRating;
          return (
            <button
              key={star}
              type="button"
              disabled={readOnly}
              onClick={() => onRatingChange?.(star)}
              onMouseEnter={() => !readOnly && setHoverRating(star)}
              onMouseLeave={() => !readOnly && setHoverRating(null)}
              className={`transition-transform duration-150 ${
                readOnly ? "cursor-default" : "cursor-pointer hover:scale-115 focus:outline-none"
              }`}

            >
              <Star
                className={`${sizeClasses[size]} ${
                  isFilled
                    ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                    : "text-slate-300 fill-slate-100"
                }`}
              />
            </button>
          );
        })}
      </div>
      {!readOnly && activeRating > 0 && (
        <span className="text-xs font-semibold text-amber-700 transition-opacity">
          {RATING_LABELS[activeRating]} ({activeRating} / 5 Stars)
        </span>
      )}
    </div>
  );
}
