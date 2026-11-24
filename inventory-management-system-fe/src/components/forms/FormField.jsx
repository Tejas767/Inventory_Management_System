/**
 * ============================================================
 * FORM FIELD — Premium label + input + error message
 * ============================================================
 *
 * USAGE:
 *   <FormField label="Product Name" value={name} onChange={setName} error={errors.name} />
 */

"use client";

export default function FormField({
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  error = "",
  readOnly = false,
  required = false,
  name,
  min,
  ...props
}) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        min={min}
        className={`
          w-full border px-3.5 py-2.5 rounded-lg text-sm
          focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40
          transition-all duration-200
          ${readOnly ? "bg-surface-hover cursor-not-allowed text-text-secondary" : "bg-surface text-text-primary"}
          ${error ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-border"}
        `}
        {...props}
      />

      {error && (
        <p className="text-red-500 text-xs mt-1.5">{error}</p>
      )}
    </div>
  );
}
