/**
 * Queries Loading Skeleton
 */

export default function QueriesLoading() {
  return (
    <main className="min-h-[50vh]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-32 rounded-lg animate-shimmer" />
            <div className="h-4 w-72 rounded-lg animate-shimmer" />
          </div>
          <div className="h-10 w-28 rounded-lg animate-shimmer" />
        </div>

        <div className="h-12 rounded-xl animate-shimmer" />

        <div className="flex gap-2">
          <div className="h-9 w-24 rounded-lg animate-shimmer" />
          <div className="h-9 w-24 rounded-lg animate-shimmer" />
        </div>

        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-5 shadow-[var(--shadow-card)] space-y-4">
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <div className="h-9 w-9 rounded-lg animate-shimmer" />
                  <div className="space-y-2">
                    <div className="h-5 w-48 rounded-md animate-shimmer" />
                    <div className="h-3 w-36 rounded-md animate-shimmer" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 rounded-md animate-shimmer" />
                  <div className="h-6 w-16 rounded-md animate-shimmer" />
                </div>
              </div>
              <div className="h-4 w-full rounded-md animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
