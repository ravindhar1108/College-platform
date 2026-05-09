import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CollegeCard } from "@/components/CollegeCard";
import { EmptyState } from "@/components/EmptyState";
import { colleges } from "@/lib/colleges-data";
import { useAppStore } from "@/lib/store";
import { useCompare } from "@/hooks/queries";

export const Route = createFileRoute("/saved")({
  beforeLoad: () => {
    const token = localStorage.getItem("token");
    if (!token) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "Saved Colleges — EduFind" }] }),
  component: SavedPage,
});

function SavedPage() {
  const saved = useAppStore((s) => s.saved);
  const { data: items = [], isLoading } = useCompare(saved);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <h1 className="text-3xl font-bold tracking-tight">Saved Colleges</h1>
        <p className="mt-1 text-sm text-muted-foreground">{items.length} colleges in your list</p>

        <div className="mt-8">
          {isLoading ? (
             <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
               {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-64 animate-pulse rounded-2xl bg-secondary" />)}
             </div>
          ) : items.length === 0 ? (
            <EmptyState
              icon={<Heart className="h-6 w-6" />}
              title="No saved colleges yet"
              description="Browse colleges and tap the heart icon to save them here."
              action={
                <Link to="/colleges" className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                  Explore colleges
                </Link>
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((c) => <CollegeCard key={c.id} college={c} />)}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
