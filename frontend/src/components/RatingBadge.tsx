import { Star } from "lucide-react";

export function RatingBadge({ rating }: { rating: number }) {
  const tone =
    rating >= 9 ? "bg-success text-success-foreground" :
    rating >= 8 ? "bg-primary text-primary-foreground" :
    "bg-warning text-warning-foreground";
  return (
    <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${tone}`}>
      <Star className="h-3 w-3 fill-current" /> {rating.toFixed(1)}
    </span>
  );
}
