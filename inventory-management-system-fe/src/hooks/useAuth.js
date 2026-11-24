/**
 * ============================================================
 * useAuth Hook — Access auth state from any component
 * ============================================================
 *
 * USAGE:
 *   const { user, role, isAuthenticated, logout } = useAuth();
 *
 * This hook reads from the AuthProvider context.
 * Must be used inside a component wrapped by <AuthProvider>.
 */

"use client";

import { useContext } from "react";
import { AuthContext } from "@/lib/rbac/AuthProvider";

export function useAuth() {
  const context = useContext(AuthContext);

  // Safety check — makes sure AuthProvider is in the tree
  if (!context) {
    throw new Error("useAuth must be used inside an <AuthProvider>");
  }

  return context;
}
