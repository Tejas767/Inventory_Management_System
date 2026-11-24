/**
 * ============================================================
 * MOBILE MENU — Slide-in sidebar overlay for mobile
 * ============================================================
 *
 * Full-height slide-in panel from the left with backdrop overlay.
 * Mirrors desktop sidebar layout for a consistent experience.
 */

"use client";

import { X } from "lucide-react";
import { SidebarNavLinks } from "./NavLinks";
import UserMenu from "./UserMenu";

export default function MobileMenu({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="md:hidden fixed inset-0 bg-black/50 z-40 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in sidebar panel */}
      <div className="md:hidden fixed inset-y-0 left-0 w-72 bg-sidebar z-50 flex flex-col animate-slideInLeft">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">IM</span>
            </div>
            <span className="text-white font-semibold text-sm">Inventory Manager</span>
          </div>
          <button
            onClick={onClose}
            className="text-sidebar-text hover:text-white p-1 transition"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <SidebarNavLinks onLinkClick={onClose} />
        </nav>

        {/* User section */}
        <div className="px-3 pb-4 border-t border-white/10 pt-4">
          <UserMenu />
        </div>
      </div>
    </>
  );
}
