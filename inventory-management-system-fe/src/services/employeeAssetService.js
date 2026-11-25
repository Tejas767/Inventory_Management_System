/**
 * ============================================================
 * EMPLOYEE ASSET SERVICE — Asset allocation API calls
 * ============================================================
 *
 * Handles assigning/removing products to/from employees.
 */

import { apiClient } from "./api";

export const employeeAssetService = {
  /**
   * Fetch assets assigned to the currently logged-in user.
   */
  getMyAssets: async () => {
    const res = await apiClient("/employees/me/assets", { method: "GET" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch your assets");
    return {
      assets: data.data || [],
      linkedEmployee: data.linkedEmployee || null,
    };
  },

  /**
   * Fetch all assets assigned to a specific employee.
   * @param {string} employeeId - Employee UUID
   */
  getEmployeeAssets: async (employeeId) => {
    const res = await apiClient(`/employees/${employeeId}/assets`, {
      method: "GET",
    });
    const data = await res.json();

    if (!res.ok) throw new Error("Failed to fetch assets");

    return data.data || [];
  },

  /**
   * Allocate a product to an employee.
   * @param {object} payload - { employeeId, productId, allocatedDate }
   */
  allocateAsset: async ({ employeeId, productId, allocatedDate }) => {
    const res = await apiClient("/employee-assets", {
      method: "POST",
      body: JSON.stringify({ employeeId, productId, allocatedDate }),
    });

    if (!res.ok) throw new Error("Asset allocation failed");

    return await res.json();
  },

  /**
   * Remove an allocated asset from an employee.
   * @param {string} assignmentId - Assignment UUID
   */
  removeAsset: async (assignmentId) => {
    const res = await apiClient(`/employee-assets/${assignmentId}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to remove asset");

    return true;
  },
};
