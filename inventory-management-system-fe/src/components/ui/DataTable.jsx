/**
 * ============================================================
 * DATA TABLE — Premium table with animated loading skeleton
 * ============================================================
 *
 * USAGE:
 *   const columns = [
 *     { key: "name", label: "Product Name" },
 *     { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
 *   ];
 *
 *   <DataTable columns={columns} data={products} loading={isLoading} />
 */

"use client";

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No data found.",
}) {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-[var(--shadow-card)]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3.5 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border-light">
            {/* Loading Skeleton */}
            {loading &&
              [1, 2, 3, 4, 5].map((row) => (
                <tr key={row}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      <div className="h-4 rounded-md animate-shimmer" />
                    </td>
                  ))}
                </tr>
              ))}

            {/* Empty State */}
            {!loading && data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-12 text-text-muted"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10 text-text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <span className="text-sm">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            )}

            {/* Data Rows */}
            {!loading &&
              data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className="hover:bg-accent-light/30 transition-colors duration-150"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-4 text-text-primary whitespace-nowrap"
                    >
                      {col.render ? col.render(row) : row[col.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
