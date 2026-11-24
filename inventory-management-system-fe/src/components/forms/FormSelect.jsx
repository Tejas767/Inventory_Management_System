/**
 * ============================================================
 * FORM SELECT — Premium label + select + error message
 * ============================================================
 *
 * USAGE:
 *   <FormSelect
 *     label="Category"
 *     value={categoryId}
 *     onChange={(e) => setCategoryId(e.target.value)}
 *     options={categories.map(c => ({ value: c.id, label: c.name }))}
 *   />
 */

"use client";

export default function FormSelect({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  error = "",
  required = false,
}) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <select
        value={value}
        onChange={onChange}
        className={`
          w-full border px-3.5 py-2.5 rounded-lg text-sm bg-surface text-text-primary
          focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40
          transition-all duration-200
          ${error ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-border"}
        `}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="text-red-500 text-xs mt-1.5">{error}</p>
      )}
    </div>
  );
}
