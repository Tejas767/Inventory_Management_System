/**
 * ============================================================
 * NAV LINKS — Sidebar navigation items
 * ============================================================
 *
 * Vertical sidebar links with indigo active pill and icon + label.
 * Used in both desktop sidebar and mobile slide-out menu.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Box, Users, MessageSquare } from "lucide-react";

// Navigation items — add new routes here
const NAV_ITEMS = [
  { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
  { name: "Products", icon: Box, href: "/products" },
  { name: "Employees", icon: Users, href: "/employees" },
  { name: "Queries", icon: MessageSquare, href: "/queries" },
];

/**
 * Sidebar nav links (vertical with pill active indicator)
 */
export function SidebarNavLinks({ onLinkClick }) {
  const pathname = usePathname();

  return (
    <>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onLinkClick}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
              transition-all duration-200 group
              ${isActive
                ? "bg-accent text-white shadow-sm shadow-accent/25"
                : "text-sidebar-text hover:bg-sidebar-hover hover:text-white"
              }
            `}
          >
            <Icon
              size={18}
              className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                isActive ? "text-white" : ""
              }`}
            />
            {item.name}
          </Link>
        );
      })}
    </>
  );
}
