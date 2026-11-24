/**
 * ============================================================
 * TOPBAR — Compact top bar for the content area
 * ============================================================
 *
 * Shown above the main content on desktop. Provides a clean
 * visual header with a greeting and optional breadcrumb area.
 */

"use client";

import { useAuth } from "@/hooks/useAuth";

export default function Topbar() {
  const { user } = useAuth();
  const userName = user?.name || "User";

  return (
    <header className="hidden md:flex items-center justify-between h-16 px-8 bg-surface border-b border-border">
      {/* Left: Greeting */}
      <div>
        <p className="text-sm text-text-secondary">
          Welcome back,{" "}
          <span className="font-semibold text-text-primary">{userName}</span>
        </p>
      </div>

      {/* Right: Avatar */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
          <span className="text-xs font-semibold text-accent">
            {userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
          </span>
        </div>
      </div>
    </header>
  );
}
