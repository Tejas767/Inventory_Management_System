/**
 * Dashboard Loading Skeleton — Shimmer animation.
 */

export default function DashboardLoading() {
  return (
    <main className="min-h-[50vh]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-lg animate-shimmer" />
          <div className="h-4 w-72 rounded-lg animate-shimmer" />
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-border rounded-xl p-6 space-y-4 shadow-[var(--shadow-card)]">
              <div className="flex justify-between">
                <div className="h-4 w-24 rounded-md animate-shimmer" />
                <div className="h-9 w-9 rounded-lg animate-shimmer" />
              </div>
              <div className="h-7 w-16 rounded-md animate-shimmer" />
              <div className="h-3 w-32 rounded-md animate-shimmer" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card)]">
          <div className="px-6 py-5 border-b border-border space-y-2">
            <div className="h-5 w-40 rounded-md animate-shimmer" />
            <div className="h-3 w-56 rounded-md animate-shimmer" />
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="grid grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-4 rounded-md animate-shimmer" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
