import { Search, RotateCcw, MapPin, Star, Wallet } from "lucide-react";

export type Filters = {
  query: string;
  location: string;
  minFees: number;
  maxFees: number;
  minRating: number;
};

export const defaultFilters: Filters = {
  query: "",
  location: "All",
  minFees: 0,
  maxFees: 2000000,
  minRating: 0,
};

export function FilterSidebar({
  filters,
  setFilters,
  states,
  feeStats,
}: {
  filters: Filters;
  setFilters: (f: Filters) => void;
  states: string[];
  feeStats?: { minFee: number; maxFee: number };
}) {
  const min = feeStats?.minFee ?? 0;
  const max = feeStats?.maxFee ?? 2000000;

  return (
    <aside className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filters</h3>
        <button
          onClick={() => setFilters({ ...defaultFilters, minFees: min, maxFees: max })}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          <RotateCcw className="h-3 w-3" /> Reset
        </button>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <label className="text-xs font-medium text-muted-foreground">College name</label>
          <div className="relative mt-1.5">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              placeholder="e.g. IIT, IIM"
              className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-ring"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3 w-3" /> State
          </label>
          <select
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="mt-1.5 h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:border-ring"
          >
            {states.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1"><Wallet className="h-3 w-3" /> Fee Range</span>
            <span className="font-semibold text-foreground">
              ₹{(filters.minFees / 100000).toFixed(1)}L - ₹{(filters.maxFees / 100000).toFixed(1)}L
            </span>
          </label>
          <div className="mt-4 space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Min: ₹{(filters.minFees / 100000).toFixed(1)}L</span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={5000}
                value={filters.minFees}
                onChange={(e) => {
                  const val = Math.min(+e.target.value, filters.maxFees - 10000);
                  setFilters({ ...filters, minFees: val });
                }}
                className="h-1.5 w-full appearance-none rounded-lg bg-secondary accent-primary"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Max: ₹{(filters.maxFees / 100000).toFixed(1)}L</span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                step={5000}
                value={filters.maxFees}
                onChange={(e) => {
                  const val = Math.max(+e.target.value, filters.minFees + 10000);
                  setFilters({ ...filters, maxFees: val });
                }}
                className="h-1.5 w-full appearance-none rounded-lg bg-secondary accent-primary"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Star className="h-3 w-3" /> Minimum rating
          </label>
          <div className="mt-2 grid grid-cols-5 gap-1.5">
            {[0, 6, 7, 8, 9].map((r) => (
              <button
                key={r}
                onClick={() => setFilters({ ...filters, minRating: r })}
                className={`rounded-lg border px-2 py-1.5 text-xs font-medium transition ${
                  filters.minRating === r
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-input hover:bg-secondary"
                }`}
              >
                {r === 0 ? "Any" : `${r}+`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
