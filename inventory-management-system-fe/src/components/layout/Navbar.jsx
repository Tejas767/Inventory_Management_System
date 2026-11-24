/**
 * ============================================================
 * SIDEBAR — Premium vertical sidebar navigation
 * ============================================================
 *
 * Replaces the old top Navbar. Dark slate sidebar with:
 * - Logo at top
 * - Vertical nav links with indigo active state
 * - User menu at bottom
 * - Mobile slide-out overlay
 */

"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { SidebarNavLinks } from "./NavLinks";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex md:flex-col md:fixed md:inset-y-0 md:left-0 md:w-64 bg-sidebar z-30">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-sm">IM</span>
          </div>
          <h1 className="text-base font-semibold text-white tracking-tight">
            Inventory Manager
          </h1>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <SidebarNavLinks />
        </nav>

        {/* User / Logout — bottom */}
        <div className="px-3 pb-4 border-t border-white/10 pt-4">
          <UserMenu />
        </div>
      </aside>

      {/* ── Mobile Top Bar ── */}
      <div className="md:hidden sticky top-0 z-40 bg-sidebar h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white p-1.5 rounded-lg hover:bg-sidebar-hover transition"
            aria-label="Toggle navigation"
          >
            <Menu size={22} />
          </button>
          <span className="text-white font-semibold text-sm">Inventory Manager</span>
        </div>
      </div>

      {/* Mobile slide-out */}
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
