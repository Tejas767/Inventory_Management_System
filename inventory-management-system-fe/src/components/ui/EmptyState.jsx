/**
 * ============================================================
 * EMPTY STATE — Premium "no data" display
 * ============================================================
 *
 * USAGE:
 *   <EmptyState message="No products found." />
 *   <EmptyState message="No queries yet." action={<Button>Create Query</Button>} />
 */

import { Inbox } from "lucide-react";

export default function EmptyState({ message = "No data found.", action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-text-muted">
      <div className="w-14 h-14 rounded-full bg-surface-hover flex items-center justify-center mb-4">
        <Inbox size={24} className="text-text-muted" />
      </div>
      <p className="text-sm font-medium">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
