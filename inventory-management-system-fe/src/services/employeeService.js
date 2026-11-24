/**
 * ============================================================
 * EMPLOYEE SERVICE — Employee-related API calls
 * ============================================================
 */

import { apiClient } from "./api";

export const employeeService = {
  /**
   * Fetch all employees.
   * Returns an array of employee objects.
   */
  getEmployees: async () => {
    const res = await apiClient("/employees", { method: "GET" });
    const result = await res.json();

    if (!res.ok) throw new Error("Failed to fetch employees");

    return result.data || result || [];
  },

  /**
   * Create a new employee.
   * @param {object} employeeData - { name, email, department, position, joiningDate }
   */
  createEmployee: async (employeeData) => {
    const res = await apiClient("/employees", {
      method: "POST",
      body: JSON.stringify(employeeData),
    });

    if (!res.ok) throw new Error("Failed to add employee");

    return await res.json();
  },

  /**
   * Delete an employee by ID.
   * @param {string} id - Employee UUID
   */
  deleteEmployee: async (id) => {
    const res = await apiClient(`/employees/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Please remove all assets to delete employee");
    }

    return true;
  },
};
