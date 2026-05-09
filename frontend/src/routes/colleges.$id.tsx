import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Heart, GitCompare, Award, Briefcase, TrendingUp, Users, ShieldCheck, Calendar, Star } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RatingBadge } from "@/components/RatingBadge";
import { CollegeCard } from "@/components/CollegeCard";
import { formatINR, type College } from "@/lib/colleges-data";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { collegesApi } from "@/lib/api";

export const Route = createFileRoute("/colleges/$id")({
  loader: async ({ params }) => {
    try {
      const college = await collegesApi.getById(params.id);
      return { college };
    } catch (e) {
      throw notFound();
    }
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.college.name} — EduFind` },
      { name: "description", content: loaderData?.college.description },
    ],
  }),
  component: CollegeDetailPage,
  notFoundComponent: () => (
    <div className="min-h-screen"><Navbar /><div className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">College not found</h1>
      <Link to="/colleges" className="mt-6 inline-block rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Back to Colleges</Link>
    </div></div>
  ),
});

function CollegeDetailPage() {
  const { college } = Route.useLoaderData() as { college: College };
  const { saved, compare, toggleSaved, toggleCompare } = useAppStore();
  const isSaved = saved.includes(college.id);
  const isCompared = compare.includes(college.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-secondary/30 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <Link to="/colleges" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Back to colleges
          </Link>
            <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <RatingBadge rating={college.rating} />
                  <span className="rounded-lg bg-secondary px-2 py-1 text-xs font-medium">AICTE Approved</span>
                </div>
                <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">{college.name}</h1>
                <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {college.location}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { toggleSaved(college.id); toast.success(isSaved ? "Removed" : "Saved"); }}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                    isSaved ? "border-destructive/30 bg-destructive/10 text-destructive" : "border-input hover:bg-secondary"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} /> {isSaved ? "Saved" : "Save College"}
                </button>
                <button
                  onClick={() => {
                    const was = isCompared;
                    toggleCompare(college.id);
                    if (!was && compare.length >= 3) toast.error("You can compare up to 3");
                    else toast.success(was ? "Removed" : "Added to compare");
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    isCompared ? "bg-primary-soft text-primary" : "bg-primary text-primary-foreground hover:opacity-90"
                  }`}
                >
                  <GitCompare className="h-4 w-4" /> {isCompared ? "Added" : "Add to Compare"}
                </button>
              </div>
            </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-10">
            {/* Overview */}
            <div>
              <h2 className="text-xl font-semibold">Overview</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{college.description}</p>
              
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Academic", val: college.academicRating },
                  { label: "Faculty", val: college.facultyRating },
                  { label: "Infrastructure", val: college.infrastructureRating },
                  { label: "Social Life", val: college.socialLifeRating },
                  { label: "Accommodation", val: college.accommodationRating },
                  { label: "Placement", val: college.placementRating },
                ].filter(r => r.val !== null).map((r) => (
                  <div key={r.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span>{r.label}</span>
                      <span className="text-muted-foreground">{r.val}/10</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-primary transition-all" style={{ width: `${(r.val || 0) * 10}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Courses */}
            <div>
              <h2 className="text-xl font-semibold">Courses Offered</h2>
              <div className="mt-4 overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary/60 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Course</th>
                      <th className="px-4 py-3 text-left font-medium">Duration</th>
                      <th className="px-4 py-3 text-right font-medium">Total Fees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {college.courses.map((c) => (
                      <tr key={c.name} className="border-t border-border">
                        <td className="px-4 py-3 font-medium">{c.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{c.duration}</td>
                        <td className="px-4 py-3 text-right font-semibold">{formatINR(c.fees)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Admission Info */}
            <div className="rounded-2xl bg-secondary/30 p-6">
              <h2 className="text-lg font-semibold">Admission & Fees</h2>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">UG Fee Structure</p>
                  <p className="text-2xl font-bold text-primary">{formatINR(college.ugFee)}</p>
                  <p className="text-xs text-muted-foreground">Average yearly tuition</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">PG Fee Structure</p>
                  <p className="text-2xl font-bold text-primary">{college.pgFee ? formatINR(college.pgFee) : "N/A"}</p>
                  <p className="text-xs text-muted-foreground">For masters programs</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="text-xl font-semibold">Student Reviews</h2>
              <div className="mt-4 space-y-3">
                {college.reviews.map((r, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold uppercase text-muted-foreground">
                        {r.userName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold">{r.userName}</p>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" /> {r.date}
                          </span>
                        </div>
                        <div className="mt-1 flex">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star key={j} className={`h-3.5 w-3.5 ${j < (r.rating) ? "fill-warning text-warning" : "text-muted"}`} />
                          ))}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky info */}
          <aside>
            <div className="sticky top-20 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-sm font-semibold">Quick Info</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  {[
                    ["UG Fees", formatINR(college.ugFee)],
                    ["PG Fees", college.pgFee ? formatINR(college.pgFee) : "N/A"],
                    ["Overall Rating", `${college.rating} / 10`],
                    ["Location", college.location],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-semibold">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}
