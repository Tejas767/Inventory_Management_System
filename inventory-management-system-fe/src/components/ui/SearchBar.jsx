/**
 * ============================================================
 * SEARCH BAR — Clean inline search with focus effect
 * ============================================================
 *
 * USAGE:
 *   <SearchBar
 *     value={searchTerm}
 *     onChange={(e) => setSearchTerm(e.target.value)}
 *     placeholder="Search products..."
 *   />
 */

"use client";

import { Search } from "lucide-react";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}) {
  return (
    <div className="relative group">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors duration-200"
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full pl-11 pr-4 py-3 rounded-xl
          bg-surface border border-border
          text-sm text-text-primary
          shadow-[var(--shadow-card)]
          focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40
          placeholder:text-text-muted
          transition-all duration-200
        "
      />
    </div>
  );
}
