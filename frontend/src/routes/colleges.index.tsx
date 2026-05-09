import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Sparkles, SlidersHorizontal, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CollegeCard } from "@/components/CollegeCard";
import { CollegeCardSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { FilterSidebar, defaultFilters, type Filters } from "@/components/FilterSidebar";
import { useColleges, useCollegeStats } from "@/hooks/queries";

export const Route = createFileRoute("/colleges/")({
  head: () => ({
    meta: [
      { title: "Explore Colleges — EduFind" },
      { name: "description", content: "Browse top colleges across India. Filter by fees, location and rating." },
    ],
  }),
  component: CollegesPage,
});

const PER_PAGE = 12;



function CollegesPage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [page, setPage] = useState(1);
  const [mobileFilter, setMobileFilter] = useState(false);

  const { data: statsData } = useCollegeStats();

  // Initialize filters with real min/max from DB
  useEffect(() => {
    if (statsData) {
      setFilters(f => ({
        ...f,
        minFees: statsData.minFee,
        maxFees: statsData.maxFee,
      }));
    }
  }, [statsData]);

  const { data, isLoading: loading } = useColleges({
    page,
    limit: PER_PAGE,
    search: filters.query,
    location: filters.location,
    minFees: filters.minFees,
    maxFees: filters.maxFees,
    minRating: filters.minRating,
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  const collegesData = data?.data || [];
  const states = useMemo(() => [
    "All", "Tamil Nadu", "Maharashtra", "Karnataka", "Uttar Pradesh", "West Bengal", 
    "Gujarat", "Rajasthan", "Madhya Pradesh", "Delhi", "Telangana", "Kerala"
  ], []);

  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full opacity-30 blur-3xl" style={{ background: "var(--gradient-primary)" }} />
        <div className="absolute -bottom-40 -left-20 h-80 w-80 rounded-full opacity-20 blur-3xl" style={{ background: "var(--gradient-primary)" }} />
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
              Find the Right <span className="bg-gradient-to-r from-primary to-[oklch(0.65_0.18_235)] bg-clip-text text-transparent">Engineering College</span>
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              Comprehensive data on Indian engineering institutions. Compare fees, ratings, and placement statistics to make an informed choice.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#listings" className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90">
                Explore Colleges
              </a>
              <Link to="/compare" className="rounded-xl border border-input bg-card px-5 py-3 text-sm font-medium transition hover:bg-secondary">
                Compare Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section id="listings" className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Top Colleges</h2>
            <p className="text-sm text-muted-foreground">{collegesData.length} results</p>
          </div>
          <button
            onClick={() => setMobileFilter(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-input px-3 py-2 text-sm font-medium md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          <div className="hidden md:block">
            <div className="sticky top-20">
              <FilterSidebar 
                filters={filters} 
                setFilters={setFilters} 
                states={statsData?.states ? ["All", ...statsData.states] : ["All"]} 
                feeStats={statsData}
              />
            </div>
          </div>

          <div>
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <CollegeCardSkeleton key={i} />)}
              </div>
            ) : collegesData.length === 0 ? (
              <EmptyState
                title="No colleges found"
                description="Try adjusting your filters or search for a different keyword."
                action={
                  <button
                    onClick={() => setFilters(defaultFilters)}
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Reset filters
                  </button>
                }
              />
            ) : (
              <>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {collegesData.map((c) => <CollegeCard key={c.id} college={c} />)}
                </div>
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-4">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="rounded-xl border border-input bg-card px-4 py-2 text-sm font-medium transition hover:bg-secondary disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-sm font-medium text-muted-foreground">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="rounded-xl border border-input bg-card px-4 py-2 text-sm font-medium transition hover:bg-secondary disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      {mobileFilter && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setMobileFilter(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background p-5 animate-fade-in">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold">Filters</h3>
              <button onClick={() => setMobileFilter(false)} className="grid h-9 w-9 place-items-center rounded-xl border border-input">
                <X className="h-4 w-4" />
              </button>
            </div>
            <FilterSidebar 
              filters={filters} 
              setFilters={setFilters} 
              states={statsData?.states ? ["All", ...statsData.states] : ["All"]} 
              feeStats={statsData}
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
