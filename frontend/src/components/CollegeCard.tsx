import { Link } from "@tanstack/react-router";
import { MapPin, Heart, GitCompare, TrendingUp } from "lucide-react";
import { College, formatINR } from "@/lib/colleges-data";
import { RatingBadge } from "./RatingBadge";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";

export function CollegeCard({ college }: { college: College }) {
  const { saved, compare, toggleSaved, toggleCompare } = useAppStore();
  const isSaved = saved.includes(college.id);
  const isCompared = compare.includes(college.id);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card hover-lift">
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-start justify-between">
          <RatingBadge rating={college.rating} />
          <button
            onClick={() => {
              toggleSaved(college.id);
              toast.success(isSaved ? "Removed from saved" : "Saved to your list");
            }}
            aria-label="Save"
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card transition active:scale-90"
          >
            <Heart className={`h-4 w-4 transition ${isSaved ? "fill-destructive text-destructive" : "text-foreground"}`} />
          </button>
        </div>
        <h3 className="line-clamp-2 text-base font-semibold leading-snug">{college.name}</h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {college.location}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
          <div className="text-sm font-semibold text-foreground">
            {formatINR(college.ugFee)} <span className="text-[10px] font-normal text-muted-foreground uppercase">UG Fee</span>
          </div>
          <div className="text-sm font-medium text-muted-foreground">
            {college.pgFee ? formatINR(college.pgFee) : "--"} <span className="text-[10px] font-normal uppercase">PG Fee</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Link
            to="/colleges/$id"
            params={{ id: String(college.id) }}
            className="flex-1 rounded-xl bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            View Details
          </Link>
          <button
            onClick={() => {
              const wasCompared = isCompared;
              toggleCompare(college.id);
              if (!wasCompared && compare.length >= 3) toast.error("You can compare up to 3 colleges");
              else toast.success(wasCompared ? "Removed from compare" : "Added to compare");
            }}
            aria-label="Compare"
            title="Compare"
            className={`grid h-10 w-10 place-items-center rounded-xl border transition ${
              isCompared ? "border-primary bg-primary-soft text-primary" : "border-input hover:bg-secondary"
            }`}
          >
            <GitCompare className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
