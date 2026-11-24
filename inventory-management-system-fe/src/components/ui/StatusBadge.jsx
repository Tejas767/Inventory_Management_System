/**
 * ============================================================
 * STATUS BADGE — Colored pill with dot indicator
 * ============================================================
 *
 * USAGE:
 *   <StatusBadge text="Available" className="bg-green-50 text-green-700" />
 *   <StatusBadge text="Low Stock" className="bg-yellow-50 text-yellow-700" />
 */

export default function StatusBadge({ text, className = "" }) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md
        text-xs font-medium whitespace-nowrap
        ${className}
      `}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {text}
    </span>
  );
}
