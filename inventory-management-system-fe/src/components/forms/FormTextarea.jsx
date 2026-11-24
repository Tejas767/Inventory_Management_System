/**
 * ============================================================
 * FORM TEXTAREA — Premium label + textarea + error message
 * ============================================================
 *
 * USAGE:
 *   <FormTextarea
 *     label="Description"
 *     value={description}
 *     onChange={(e) => setDescription(e.target.value)}
 *     rows={3}
 *   />
 */

"use client";

export default function FormTextarea({
  label,
  value,
  onChange,
  placeholder = "",
  error = "",
  rows = 3,
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

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full border px-3.5 py-2.5 rounded-lg text-sm bg-surface text-text-primary resize-none
          focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40
          transition-all duration-200
          ${error ? "border-red-300 focus:ring-red-200 focus:border-red-400" : "border-border"}
        `}
      />

      {error && (
        <p className="text-red-500 text-xs mt-1.5">{error}</p>
      )}
    </div>
  );
}
