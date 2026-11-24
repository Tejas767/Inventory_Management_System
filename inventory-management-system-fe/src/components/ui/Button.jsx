/**
 * ============================================================
 * BUTTON — Premium button with variants and micro-animations
 * ============================================================
 *
 * USAGE:
 *   <Button variant="primary" onClick={handleClick}>Save</Button>
 *   <Button variant="danger" loading={true}>Deleting...</Button>
 *   <Button variant="ghost" icon={<Plus size={16} />}>Add New</Button>
 */

"use client";

const VARIANTS = {
  primary:
    "bg-accent text-white hover:bg-accent-hover shadow-sm hover:shadow-md",
  secondary:
    "bg-white text-text-primary border border-border hover:bg-surface-hover shadow-sm",
  danger:
    "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md",
  ghost:
    "text-text-secondary hover:bg-surface-hover hover:text-text-primary",
};

export default function Button({
  children,
  variant = "primary",
  loading = false,
  disabled = false,
  icon = null,
  type = "button",
  onClick,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        px-4 py-2.5 rounded-lg text-sm font-medium
        transition-all duration-200 ease-out
        active:scale-[0.97]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        cursor-pointer
        ${VARIANTS[variant] || VARIANTS.primary}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
