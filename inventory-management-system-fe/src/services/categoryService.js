/**
 * ============================================================
 * CATEGORY SERVICE — Category API calls
 * ============================================================
 */

import { apiClient } from "./api";

export const categoryService = {
  /**
   * Fetch all product categories.
   * Returns an array of { id, name } objects.
   */
  getCategories: async () => {
    const res = await apiClient("/categories", { method: "GET" });
    const json = await res.json();

    if (!res.ok) throw new Error(json.message || "Failed to fetch categories");

    return json.data || [];
  },
};
