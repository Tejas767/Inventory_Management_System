/**
 * ============================================================
 * ROLE CONSTANTS — Define all user roles in one place
 * ============================================================
 *
 * WHY THIS FILE:
 * Instead of using string literals like "ADMIN" everywhere,
 * we use constants. This prevents typos and makes it easy
 * to add new roles later.
 *
 * USAGE:
 *   import { ROLES } from "@/lib/constants/roles";
 *   if (user.role === ROLES.ADMIN) { ... }
 */

export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
  USER: "USER",
};

/**
 * Human-readable labels for each role.
 * Used in dropdowns and display.
 */
export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.MANAGER]: "Manager",
  [ROLES.EMPLOYEE]: "Employee",
  [ROLES.USER]: "User",
};
