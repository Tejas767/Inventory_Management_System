/**
 * ============================================================
 * PRODUCT SERVICE — All product-related API calls
 * ============================================================
 */

import { apiClient } from "./api";

export const productService = {
  /**
   * Fetch all products from the backend.
   * Returns an array of product objects.
   */
  getProducts: async () => {
    const res = await apiClient("/products", { method: "GET" });
    const json = await res.json();

    if (!res.ok) throw new Error(json.message || "Failed to fetch products");

    return json.data || [];
  },

  /**
   * Create a new product.
   * @param {object} productData - { name, categoryId, quantity, minStock, serialNumber, purchaseDate }
   */
  createProduct: async (productData) => {
    const res = await apiClient("/products", {
      method: "POST",
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to add product");
    }

    const result = await res.json();
    return result.data;
  },

  /**
   * Update an existing product.
   * @param {string} id - Product UUID
   * @param {object} productData - Updated product fields
   */
  updateProduct: async (id, productData) => {
    const res = await apiClient(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Update failed");
    }

    return true;
  },

  /**
   * Delete a product by ID.
   * @param {string} id - Product UUID
   */
  deleteProduct: async (id) => {
    const res = await apiClient(`/products/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to delete product");
    }

    return true;
  },
};
