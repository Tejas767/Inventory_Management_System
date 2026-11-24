/**
 * ============================================================
 * API CLIENT — Central API handler for all HTTP requests
 * ============================================================
 *
 * WHY THIS FILE EXISTS:
 * Instead of writing fetch() calls in every component, we use
 * this single function. It handles:
 *   - Adding the base URL automatically
 *   - Sending cookies (credentials: "include")
 *   - Auto-refreshing expired tokens (401 handling)
 *   - Logging out if refresh also fails
 *
 * HOW TO USE:
 *   import { apiClient } from "@/services/api";
 *   const res = await apiClient("/products", { method: "GET" });
 *   const data = await res.json();
 */

import toast from "react-hot-toast";

// Base URL from environment variable (set in .env file)
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// --- Token Refresh Queue ---
// Prevents multiple refresh requests if several API calls fail at once
let isRefreshing = false;
let failedQueue = [];

/**
 * Process all queued requests after token refresh completes.
 * If refresh succeeded, resolve them. If failed, reject them.
 */
const processQueue = (error) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });
  failedQueue = [];
};

/**
 * Force logout — clears user data and redirects to login page.
 * Called when both access token AND refresh token have expired.
 */
const forceLogout = async () => {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (e) {
    console.error("Logout API error:", e);
  }

  localStorage.removeItem("user");
  toast.error("Session expired. Please log in again.");
  window.location.replace("/login");
};

/**
 * Main API client function.
 *
 * @param {string} endpoint - API path (e.g., "/products", "/auth/login")
 * @param {object} options  - Fetch options (method, body, headers, etc.)
 * @returns {Response}      - The fetch Response object
 *
 * @example
 *   // GET request
 *   const res = await apiClient("/dashboard");
 *
 *   // POST request with body
 *   const res = await apiClient("/products", {
 *     method: "POST",
 *     body: JSON.stringify({ name: "Laptop" }),
 *   });
 */
export const apiClient = async (endpoint, options = {}) => {
  // Merge default config with user-provided options
  const config = {
    ...options,
    credentials: "include", // Always send cookies (for auth)
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  try {
    let response = await fetch(`${API_URL}${endpoint}`, config);

    // --- Handle 401 (Unauthorized) ---
    // This means the access token expired
    if (response.status === 401) {
      // Don't try to refresh if WE ARE the refresh request (infinite loop!)
      if (endpoint === "/auth/refresh") {
        await forceLogout();
        throw new Error("Session expired");
      }

      try {
        // If another request is already refreshing, wait for it
        if (isRefreshing) {
          await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          // Retry the original request after refresh completes
          response = await fetch(`${API_URL}${endpoint}`, config);
          return response;
        }

        // Mark that we're refreshing (so other requests wait)
        isRefreshing = true;

        // Attempt to get a new access token
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (refreshRes.ok) {
          // Refresh succeeded — process waiting requests
          processQueue(null);
          // Retry the original request
          response = await fetch(`${API_URL}${endpoint}`, config);
          return response;
        } else {
          // Refresh failed — logout and reject all waiting requests
          processQueue(new Error("Refresh failed"));
          await forceLogout();
          throw new Error("Session expired");
        }
      } catch (refreshError) {
        processQueue(refreshError);
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    return response;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
};
