export function CollegeCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-6 w-12 rounded-lg skeleton" />
        <div className="h-9 w-9 rounded-full skeleton" />
      </div>
      <div className="h-5 w-3/4 rounded skeleton" />
      <div className="mt-2 h-4 w-1/3 rounded skeleton" />
      <div className="mt-4 h-12 w-full rounded-xl skeleton" />
      <div className="mt-4 h-10 w-full rounded-xl skeleton" />
    </div>
  );
}
