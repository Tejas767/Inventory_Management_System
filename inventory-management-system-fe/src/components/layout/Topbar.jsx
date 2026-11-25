/**
 * ============================================================
 * TOPBAR — Compact top bar for the content area
 * ============================================================
 */

"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/lib/constants/roles";

export default function Topbar() {
  const { user, role } = useAuth();
  const userName = user?.name || "User";
  const isAdmin = role === ROLES.ADMIN;

  return (
    <header className="hidden md:flex items-center justify-between h-16 px-8 bg-surface border-b border-border">
      {/* Left: Greeting */}
      <div className="flex items-center gap-3">
        <p className="text-sm text-text-secondary">
          Welcome back,{" "}
          <span className="font-semibold text-text-primary">{userName}</span>
        </p>
        <span
          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide ${
            isAdmin
              ? "bg-accent/10 text-accent"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {isAdmin ? "Admin" : "Employee"}
        </span>
      </div>

      {/* Right: Avatar linking to profile */}
      <Link
        href="/profile"
        title="View My Profile"
        className="flex items-center gap-3 hover:opacity-80 transition"
      >
        <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
          <span className="text-xs font-semibold text-accent">
            {userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
          </span>
        </div>
      </Link>
    </header>
  );
}
