"use client";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readOnly?: boolean;
}

export default function StarRating({
  value,
  onChange,
  size = 20,
  readOnly = false,
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-1" dir="ltr">
      {stars.map((star) => {
        const filled = star <= Math.round(value);
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            className={readOnly ? "cursor-default" : "cursor-pointer"}
            aria-label={`${star} نجوم`}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={filled ? "#d4a83e" : "none"}
              stroke="#d4a83e"
              strokeWidth="1.5"
            >
              <path d="M12 2.5l2.9 6.13 6.6.66-4.94 4.6 1.36 6.6L12 17.3l-5.92 3.19 1.36-6.6-4.94-4.6 6.6-.66L12 2.5z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
