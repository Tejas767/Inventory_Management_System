/**
 * ============================================================
 * DASHBOARD SERVICE — Dashboard data API calls
 * ============================================================
 */

import { apiClient } from "./api";

export const dashboardService = {
  /**
   * Fetch dashboard overview data (cards + low stock table).
   * Returns { cards, lowStockTable }.
   */
  getDashboardData: async () => {
    const res = await apiClient("/dashboard", { method: "GET" });
    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to load dashboard");
    }

    return result.data; // { cards, lowStockTable }
  },
};
