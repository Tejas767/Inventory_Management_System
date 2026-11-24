/**
 * ============================================================
 * STAT CARD — Premium dashboard metric card
 * ============================================================
 *
 * USAGE:
 *   <StatCard
 *     title="Total Stock"
 *     value={250}
 *     subText="100 available"
 *     icon={<Box size={18} className="text-blue-500" />}
 *     iconBg="bg-blue-50"
 *   />
 */

export default function StatCard({ title, value, subText, icon, iconBg = "bg-accent-light" }) {
  return (
    <div className="
      bg-surface border border-border rounded-xl p-6
      shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)]
      hover:-translate-y-0.5
      transition-all duration-300 ease-out
    ">
      {/* Top row: title + icon */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <div className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
      </div>

      {/* Main value */}
      <h2 className="text-2xl font-bold mt-3 text-text-primary">{value}</h2>

      {/* Subtitle */}
      {subText && (
        <p className="text-xs text-text-muted mt-1.5">{subText}</p>
      )}
    </div>
  );
}
