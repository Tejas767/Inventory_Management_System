/**
 * ============================================================
 * USER SERVICE — Admin-only User & Role Management APIs
 * ============================================================
 */

import { apiClient } from "./api";

export const userService = {
  getUsers: async () => {
    const res = await apiClient("/users", { method: "GET" });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to fetch users");
    return json.data || { users: [], employees: [] };
  },

  updateUserRole: async (id, role) => {
    const res = await apiClient(`/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to update role");
    return json.data;
  },

  linkEmployee: async (id, payload) => {
    const res = await apiClient(`/users/${id}/link-employee`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to link employee");
    return json.data;
  },

  deleteUser: async (id) => {
    const res = await apiClient(`/users/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to delete user");
    return true;
  },
};
