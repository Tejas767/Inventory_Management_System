/**
 * App Layout — Sidebar + Content area structure.
 *
 * Responsibilities:
 * 1. Auth guard — redirects to /login if not authenticated
 * 2. Provides AuthProvider context (for useAuth hook)
 * 3. Renders the Sidebar + Topbar layout
 *
 * RBAC-READY: The AuthProvider sets up user + role context.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthProvider from "@/lib/rbac/AuthProvider";
import Sidebar from "@/components/layout/Navbar";
import Topbar from "@/components/layout/Topbar";

export default function AppLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.replace("/login");
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-sm text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <AuthProvider>
      {/* Sidebar (fixed on desktop, slide-out on mobile) */}
      <Sidebar />

      {/* Main content area — offset by sidebar width on desktop */}
      <div className="md:ml-64 min-h-screen flex flex-col bg-page-bg">
        <Topbar />
        <main className="flex-1">{children}</main>
      </div>
    </AuthProvider>
  );
}