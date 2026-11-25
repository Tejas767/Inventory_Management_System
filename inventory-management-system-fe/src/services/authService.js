/**
 * ============================================================
 * AUTH SERVICE — All authentication-related API calls
 * ============================================================
 *
 * This file centralizes auth API calls so components don't
 * need to know the API endpoints or how to call them.
 *
 * USAGE:
 *   import { authService } from "@/services/authService";
 *   const data = await authService.login({ email, password });
 */

import { apiClient } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authService = {
  /**
   * Login user with email and password.
   * Returns { user } on success.
   */
  login: async ({ email, password }) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Send/receive cookies
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        data?.error?.message || data?.message || "Invalid credentials"
      );
    }

    return data.data; // { user, token }
  },

  /**
   * Register a new user account.
   */
  register: async (formData) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) {
      const errorMessage =
        data?.error?.details || data?.error?.message || "Registration failed";
      throw new Error(errorMessage);
    }

    return data;
  },

  /**
   * Logout — clears server-side session cookie.
   */
  logout: async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  },

  /**
   * Send OTP to email for password recovery.
   */
  forgotPassword: async (email) => {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to send OTP");

    return data;
  },

  /**
   * Verify OTP code sent to email.
   */
  verifyOtp: async ({ email, otp }) => {
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Invalid OTP");

    return data;
  },

  /**
   * Reset password with a new password.
   */
  resetPassword: async ({ email, newPassword }) => {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to reset password");

    return data;
  },

  /**
   * Get current user profile + linked employee details.
   */
  getMe: async () => {
    const res = await apiClient("/auth/me", { method: "GET" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
    return data.data;
  },

  /**
   * Update current user's name.
   */
  updateProfile: async (name) => {
    const res = await apiClient("/auth/me", {
      method: "PUT",
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update profile");
    return data.data;
  },

  /**
   * Change current user's password.
   */
  changePassword: async ({ currentPassword, newPassword }) => {
    const res = await apiClient("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to change password");
    return data;
  },
};
