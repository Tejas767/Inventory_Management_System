/**
 * ============================================================
 * LOW STOCK TABLE — Premium table for dashboard low stock alerts
 * ============================================================
 */

import StatusBadge from "@/components/ui/StatusBadge";

export default function LowStockTable({ data = [] }) {
  return (
    <div className="bg-surface border border-border rounded-xl shadow-[var(--shadow-card)] overflow-hidden">
      {/* Section header */}
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-base font-semibold text-text-primary">
          Low Stock Alerts
        </h2>
        <p className="text-sm text-text-secondary mt-0.5">
          Products that need to be reordered
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Product</th>
              <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Category</th>
              <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Current Stock</th>
              <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Min Stock</th>
              <th className="px-6 py-3.5 text-xs font-semibold text-text-secondary uppercase tracking-wider">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-light">
            {data.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-10 text-text-muted">
                  No low stock items
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index} className="hover:bg-accent-light/30 transition-colors duration-150">
                  <td className="px-6 py-4 font-medium text-text-primary">{item.productName}</td>
                  <td className="px-6 py-4 text-text-secondary">{item.category}</td>
                  <td className="px-6 py-4 text-text-primary">{item.currentStock}</td>
                  <td className="px-6 py-4 text-text-primary">{item.minStock}</td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      text={item.status}
                      className={
                        item.currentStock === 0
                          ? "bg-red-50 text-red-700"
                          : "bg-amber-50 text-amber-700"
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
