/**
 * ============================================================
 * USER MENU — Sidebar bottom user section
 * ============================================================
 *
 * Shows user avatar (initials), name, and logout button.
 * Positioned at the bottom of the sidebar.
 */

"use client";

import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const userName = user?.name || "User";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3 px-2">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-semibold text-accent-muted">{initials}</span>
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{userName}</p>
        <p className="text-xs text-sidebar-text truncate">{user?.email || "user"}</p>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="
          p-2 rounded-lg text-sidebar-text 
          hover:bg-sidebar-hover hover:text-white 
          transition-all duration-200
        "
        aria-label="Logout"
        title="Logout"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
}
