/**
 * ============================================================
 * QUERY SERVICE — Query/ticket-related API calls
 * ============================================================
 */

import { apiClient } from "./api";

export const queryService = {
  /**
   * Fetch all queries.
   * Returns an array of query objects.
   */
  getQueries: async () => {
    const res = await apiClient("/queries", { method: "GET" });
    const data = await res.json();

    if (!res.ok) throw new Error("Failed to fetch queries");

    // Backend may return array directly or { data: [...] }
    return Array.isArray(data) ? data : data.data || [];
  },

  /**
   * Create a new query.
   * @param {object} queryData - { title, description, priority, employeeId, assetId }
   */
  createQuery: async (queryData) => {
    const res = await apiClient("/queries", {
      method: "POST",
      body: JSON.stringify(queryData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || data.message || "Create failed");
    }

    return data;
  },

  /**
   * Update the status of a query.
   * @param {string} id - Query UUID
   * @param {string} status - New status ("OPEN" | "IN_PROGRESS" | "CLOSED")
   */
  updateQueryStatus: async (id, status) => {
    const res = await apiClient(`/queries/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error("Update failed");

    return true;
  },
};
