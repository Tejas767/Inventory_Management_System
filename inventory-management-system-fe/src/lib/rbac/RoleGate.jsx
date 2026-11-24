/**
 * ============================================================
 * ROLE GATE — Show/hide UI based on user's role
 * ============================================================
 *
 * Use this component to conditionally render parts of the UI
 * based on the user's role. Great for hiding admin-only buttons
 * or showing different content per role.
 *
 * USAGE:
 *   import { ROLES } from "@/lib/constants/roles";
 *   import RoleGate from "@/lib/rbac/RoleGate";
 *
 *   // Only admins can see the delete button
 *   <RoleGate allowedRoles={[ROLES.ADMIN]}>
 *     <DeleteButton />
 *   </RoleGate>
 *
 *   // Show fallback for unauthorized users
 *   <RoleGate allowedRoles={[ROLES.ADMIN]} fallback={<p>Access denied</p>}>
 *     <AdminPanel />
 *   </RoleGate>
 */

"use client";

import { useAuth } from "@/hooks/useAuth";

export default function RoleGate({ allowedRoles, children, fallback = null }) {
  const { role } = useAuth();

  // If user's role is in the allowed list, show children
  if (allowedRoles.includes(role)) {
    return children;
  }

  // Otherwise show fallback (default: nothing)
  return fallback;
}
