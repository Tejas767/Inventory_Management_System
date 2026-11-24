/**
 * Products Loading Skeleton
 */

export default function ProductsLoading() {
  return (
    <main className="min-h-[50vh]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-8 w-36 rounded-lg animate-shimmer" />
            <div className="h-4 w-56 rounded-lg animate-shimmer" />
          </div>
          <div className="h-10 w-32 rounded-lg animate-shimmer" />
        </div>

        <div className="h-12 rounded-xl animate-shimmer" />

        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card)]">
          <div className="px-6 py-4 border-b border-border space-y-2">
            <div className="h-5 w-40 rounded-md animate-shimmer" />
            <div className="h-3 w-64 rounded-md animate-shimmer" />
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grid grid-cols-8 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
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
