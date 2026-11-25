/**
 * ============================================================
 * NAV LINKS — Role-aware Sidebar navigation items
 * ============================================================
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Box,
  Users,
  MessageSquare,
  Laptop,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ROLES } from "@/lib/constants/roles";

const ADMIN_NAV_ITEMS = [
  { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
  { name: "Products", icon: Box, href: "/products" },
  { name: "Employees", icon: Users, href: "/employees" },
  { name: "Queries", icon: MessageSquare, href: "/queries" },
  { name: "Users & Roles", icon: ShieldCheck, href: "/users" },
  { name: "My Profile", icon: UserCircle, href: "/profile" },
];

const USER_NAV_ITEMS = [
  { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
  { name: "My Assets", icon: Laptop, href: "/my-assets" },
  { name: "Equipment Catalog", icon: Box, href: "/products" },
  { name: "My Queries", icon: MessageSquare, href: "/queries" },
  { name: "My Profile", icon: UserCircle, href: "/profile" },
];

/**
 * Sidebar nav links (vertical with pill active indicator)
 */
export function SidebarNavLinks({ onLinkClick }) {
  const pathname = usePathname();
  const { role } = useAuth();

  const navItems = role === ROLES.ADMIN ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS;

  return (
    <>
      {navItems.map((item) => {
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
