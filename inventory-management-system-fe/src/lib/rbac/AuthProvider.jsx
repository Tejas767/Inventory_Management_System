/**
 * ============================================================
 * AUTH PROVIDER — React Context for authentication state
 * ============================================================
 *
 * This component wraps the app (or a section of it) and provides
 * auth data (user info, role, login status) to all children.
 *
 * HOW IT WORKS:
 * 1. On mount, reads user data from localStorage
 * 2. Provides { user, role, isAuthenticated, logout } via context
 * 3. Any component can read this with the useAuth() hook
 *
 * RBAC READY:
 * When you implement RBAC later, just update the `role` value
 * from the user data and use it with RoleGate component.
 */

"use client";

import { createContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "@/services/authService";

// Create the context (will be consumed by useAuth hook)
export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const router = useRouter();

  // Auth state
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading

  // --- Load user from localStorage on mount ---
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Error parsing stored user:", e);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // --- Logout function ---
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (e) {
      console.error("Logout error:", e);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    router.push("/login");
  }, [router]);

  // --- Update user helper (e.g. after profile edit) ---
  const updateUser = useCallback((updates) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...updates };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  }, []);

  // --- Context value ---
  // The `role` is extracted from the user object for convenience.
  // Your backend already returns role in the user data.
  const contextValue = {
    user,
    role: user?.role || null,
    isAuthenticated,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
