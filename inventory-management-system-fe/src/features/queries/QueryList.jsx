/**
 * ============================================================
 * QUERY LIST — Tabbed query list with premium pill tabs
 * ============================================================
 */

"use client";

import QueryCard from "./QueryCard";

export default function QueryList({
  queries = [],
  activeTab,
  onTabChange,
  onUpdateStatus,
}) {
  const openCount = queries.filter((q) => q.status !== "CLOSED").length;
  const closedCount = queries.filter((q) => q.status === "CLOSED").length;

  const filteredQueries =
    activeTab === "Open"
      ? queries.filter((q) => q.status !== "CLOSED")
      : queries.filter((q) => q.status === "CLOSED");

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "Open", label: "Open", count: openCount },
          { key: "Closed", label: "Closed", count: closedCount },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === tab.key
                ? "bg-accent text-white shadow-sm shadow-accent/25"
                : "bg-surface border border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary"
              }
            `}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Query Cards */}
      <div className="space-y-4">
        {filteredQueries.map((q) => (
          <QueryCard
            key={q.id}
            query={q}
            onUpdateStatus={onUpdateStatus}
          />
        ))}

        {filteredQueries.length === 0 && (
          <div className="text-center py-12 text-text-muted bg-surface rounded-xl border border-border shadow-[var(--shadow-card)]">
            <div className="flex flex-col items-center gap-2">
              <svg className="w-10 h-10 text-text-muted/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              <p className="text-sm">No queries found.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
