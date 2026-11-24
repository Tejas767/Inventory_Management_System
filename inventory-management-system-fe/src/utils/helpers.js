/**
 * ============================================================
 * HELPER UTILITIES — Common functions used across the app
 * ============================================================
 *
 * Put reusable helper functions here instead of duplicating
 * them across components.
 */

/**
 * Format a date string to a readable format (YYYY-MM-DD).
 * Returns "-" if the date is invalid or empty.
 *
 * @param {string|Date} dateString - Date to format
 * @returns {string} Formatted date string
 */
export function formatDate(dateString) {
  if (!dateString) return "-";

  try {
    return new Date(dateString).toISOString().split("T")[0];
  } catch {
    return "-";
  }
}

/**
 * Get Tailwind CSS classes for a product status badge.
 * Maps status names to color classes.
 *
 * @param {string} status - "Available", "Low Stock", or "Out of Stock"
 * @returns {string} Tailwind CSS class string
 */
export function getProductStatusClasses(status) {
  switch (status) {
    case "Available":
      return "bg-emerald-50 text-emerald-700";
    case "Low Stock":
      return "bg-amber-50 text-amber-700";
    case "Out of Stock":
      return "bg-red-50 text-red-700";
    default:
      return "bg-slate-50 text-slate-600";
  }
}

/**
 * Get Tailwind CSS classes for a query priority badge.
 *
 * @param {string} priority - "HIGH", "MEDIUM", or "LOW"
 * @returns {string} Tailwind CSS class string
 */
export function getPriorityClasses(priority) {
  const upper = priority?.toUpperCase();
  switch (upper) {
    case "HIGH":
      return "bg-red-50 text-red-700";
    case "MEDIUM":
      return "bg-blue-50 text-blue-700";
    case "LOW":
      return "bg-slate-50 text-slate-600";
    default:
      return "bg-slate-50 text-slate-600";
  }
}

/**
 * Get Tailwind CSS classes for a query status badge.
 *
 * @param {string} status - "OPEN", "IN_PROGRESS", or "CLOSED"
 * @returns {string} Tailwind CSS class string
 */
export function getQueryStatusClasses(status) {
  switch (status) {
    case "OPEN":
      return "bg-blue-50 text-blue-700";
    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700";
    case "CLOSED":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-slate-50 text-slate-600";
  }
}

/**
 * Format query status enum to human-readable text.
 *
 * @param {string} status - "OPEN", "IN_PROGRESS", or "CLOSED"
 * @returns {string} Formatted status text
 */
export function formatQueryStatus(status) {
  switch (status) {
    case "OPEN":
      return "Open";
    case "IN_PROGRESS":
      return "In Progress";
    case "CLOSED":
      return "Closed";
    default:
      return status;
  }
}

/**
 * Map display-friendly status to Prisma enum value.
 *
 * @param {string} displayStatus - "Open", "In Progress", or "Closed"
 * @returns {string} Prisma-compatible status enum
 */
export function toQueryStatusEnum(displayStatus) {
  const map = {
    Open: "OPEN",
    "In Progress": "IN_PROGRESS",
    Closed: "CLOSED",
  };
  return map[displayStatus] || displayStatus;
}

/**
 * Map display-friendly priority to Prisma enum value.
 *
 * @param {string} displayPriority - "Low", "Medium", or "High"
 * @returns {string} Prisma-compatible priority enum
 */
export function toPriorityEnum(displayPriority) {
  const map = { Low: "LOW", Medium: "MEDIUM", High: "HIGH" };
  return map[displayPriority] || displayPriority;
}
