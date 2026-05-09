import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, X, Check, Search, GitCompare } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { EmptyState } from "@/components/EmptyState";
import { formatINR, colleges } from "@/lib/colleges-data";
import { useAppStore } from "@/lib/store";
import { RatingBadge } from "@/components/RatingBadge";

export const Route = createFileRoute("/compare")({
  beforeLoad: () => {
    const token = localStorage.getItem("token");
    if (!token) throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "Compare Colleges — EduFind" },
      { name: "description", content: "Compare up to 3 colleges side-by-side." },
    ],
  }),
  component: ComparePage,
});

import { useCompare, useColleges } from "@/hooks/queries";

function ComparePage() {
  const { compare, toggleCompare, removeCompare, clearCompare } = useAppStore();
  const [picker, setPicker] = useState(false);
  const [q, setQ] = useState("");

  const { data: compareData, isLoading: compareLoading } = useCompare(compare);
  const { data: allCollegesData } = useColleges({ search: q });

  const selected = compareData || [];
  const available = (allCollegesData?.data || []).filter((c) => !compare.includes(c.id));

  const rows: { label: string; render: (c: College) => React.ReactNode; best?: "max" | "min" }[] = [
    { label: "Location", render: (c) => c.location },
    { label: "UG Fees", render: (c) => formatINR(c.ugFee), best: "min" },
    { label: "Overall Rating", render: (c) => <RatingBadge rating={c.rating} />, best: "max" },
    { label: "Academic", render: (c) => `${c.academicRating || "--"}/10`, best: "max" },
    { label: "Infrastructure", render: (c) => `${c.infrastructureRating || "--"}/10`, best: "max" },
    { label: "Social Life", render: (c) => `${c.socialLifeRating || "--"}/10`, best: "max" },
    { label: "Courses Offered", render: (c) => `${c.courses.length} courses` },
  ];

  const numericKey = (label: string, c: College): number | null => {
    if (label === "UG Fees") return c.ugFee;
    if (label === "Overall Rating") return c.rating;
    if (label === "Academic") return c.academicRating;
    if (label === "Infrastructure") return c.infrastructureRating;
    if (label === "Social Life") return c.socialLifeRating;
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Compare Colleges</h1>
            <p className="mt-1 text-sm text-muted-foreground">Add up to 3 colleges to compare side-by-side.</p>
          </div>
          <div className="flex gap-2">
            {compare.length > 0 && (
              <button onClick={clearCompare} className="rounded-xl border border-input px-4 py-2 text-sm font-medium hover:bg-secondary">
                Clear all
              </button>
            )}
            <button
              onClick={() => setPicker(true)}
              disabled={compare.length >= 3}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Add College
            </button>
          </div>
        </div>

        {selected.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={<GitCompare className="h-6 w-6" />}
              title="No colleges selected for comparison"
              description="Pick up to 3 colleges to see them side-by-side."
              action={
                <button onClick={() => setPicker(true)} className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                  Add a college
                </button>
              }
            />
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="mt-8 hidden overflow-hidden rounded-2xl border border-border bg-card md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-card">
                    <tr className="border-b border-border">
                      <th className="w-44 px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Field</th>
                      {selected.map((c) => (
                        <th key={c.id} className="min-w-[220px] px-5 py-4 text-left">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex h-16 w-full items-center justify-center rounded-lg bg-secondary text-primary">
                                <GitCompare className="h-6 w-6" />
                              </div>
                              <p className="mt-2 line-clamp-2 text-sm font-semibold">{c.name}</p>
                            </div>
                            <button onClick={() => removeCompare(c.id)} className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary hover:bg-destructive/10 hover:text-destructive">
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => {
                      const nums = selected.map((c) => numericKey(r.label, c));
                      const best = r.best && nums.every((n) => n !== null)
                        ? (r.best === "max" ? Math.max(...(nums as number[])) : Math.min(...(nums as number[])))
                        : null;
                      return (
                        <tr key={r.label} className="border-b border-border last:border-0">
                          <td className="px-5 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">{r.label}</td>
                          {selected.map((c, i) => {
                            const isBest = best !== null && nums[i] === best;
                            return (
                              <td key={c.id} className={`px-5 py-4 text-sm ${isBest ? "bg-success/10" : ""}`}>
                                <div className="flex items-center gap-2">
                                  {isBest && <Check className="h-4 w-4 text-success" />}
                                  <span className={isBest ? "font-semibold" : ""}>{r.render(c)}</span>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="mt-8 space-y-4 md:hidden">
              {selected.map((c) => (
                <div key={c.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="flex gap-3 p-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                      <GitCompare className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <p className="line-clamp-2 text-sm font-semibold">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.location}</p>
                    </div>
                    <button onClick={() => removeCompare(c.id)} className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <dl className="grid grid-cols-2 gap-3 border-t border-border bg-secondary/30 p-4 text-xs">
                    {rows.map((r) => (
                      <div key={r.label}>
                        <dt className="text-muted-foreground">{r.label}</dt>
                        <dd className="mt-0.5 font-semibold">{r.render(c)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {picker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setPicker(false)} />
          <div className="relative w-full max-w-lg rounded-t-3xl bg-card p-5 md:rounded-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold">Add a college</h3>
              <button onClick={() => setPicker(false)} className="grid h-8 w-8 place-items-center rounded-full bg-secondary">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="relative mt-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search colleges..."
                className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none focus:border-ring"
              />
            </div>
            <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
              {available.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No colleges available.</p>}
              {available.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { toggleCompare(c.id); setPicker(false); }}
                  className="flex w-full items-center gap-3 rounded-xl border border-border p-3 text-left transition hover:bg-secondary"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <GitCompare className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm font-semibold">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.location}</p>
                  </div>
                  <Plus className="h-4 w-4 text-primary" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
