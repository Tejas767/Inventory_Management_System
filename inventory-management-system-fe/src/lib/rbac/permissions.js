/**
 * ============================================================
 * PERMISSIONS — Role-to-permission mapping (RBAC-ready)
 * ============================================================
 *
 * This file defines WHAT each role is allowed to do.
 * Right now it's a skeleton — fill it in when you implement RBAC.
 *
 * USAGE:
 *   import { hasPermission } from "@/lib/rbac/permissions";
 *
 *   if (hasPermission(userRole, "products.delete")) {
 *     // show delete button
 *   }
 */

import { ROLES } from "@/lib/constants/roles";

/**
 * Permission map — defines which roles can do what.
 *
 * Structure: { [permissionName]: [array of allowed roles] }
 *
 * Add new permissions here as your app grows.
 */
const PERMISSIONS = {
  // Dashboard
  "dashboard.view": [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.USER],

  // Products
  "products.view": [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.USER],
  "products.create": [ROLES.ADMIN, ROLES.MANAGER],
  "products.edit": [ROLES.ADMIN, ROLES.MANAGER],
  "products.delete": [ROLES.ADMIN],

  // Employees
  "employees.view": [ROLES.ADMIN, ROLES.MANAGER],
  "employees.create": [ROLES.ADMIN, ROLES.MANAGER],
  "employees.delete": [ROLES.ADMIN],
  "employees.allocate": [ROLES.ADMIN, ROLES.MANAGER],

  // Queries
  "queries.view": [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.USER],
  "queries.create": [ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE, ROLES.USER],
  "queries.updateStatus": [ROLES.ADMIN, ROLES.MANAGER],
};

/**
 * Check if a role has a specific permission.
 *
 * @param {string} role - User's role (e.g., "ADMIN")
 * @param {string} permission - Permission to check (e.g., "products.delete")
 * @returns {boolean} Whether the role has the permission
 */
export function hasPermission(role, permission) {
  const allowedRoles = PERMISSIONS[permission];

  // If permission doesn't exist, deny by default (safe)
  if (!allowedRoles) return false;

  return allowedRoles.includes(role);
}

