/**
 * ============================================================
 * useDebounce Hook — Delay a value change
 * ============================================================
 *
 * Useful for search inputs — waits until the user stops typing
 * before triggering a search, preventing too many API calls.
 *
 * USAGE:
 *   const debouncedSearch = useDebounce(searchTerm, 300);
 *   // debouncedSearch updates 300ms after user stops typing
 */

"use client";

import { useState, useEffect } from "react";

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set a timer to update the debounced value
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timer if value changes before delay expires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
