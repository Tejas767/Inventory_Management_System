/**
 * ============================================================
 * PRODUCT SCHEMA — Zod validation for product forms
 * ============================================================
 */

import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  categoryId: z.string().min(1, "Category is required"),
  serialNumber: z.string().min(3, "Serial number must be at least 3 characters"),
  quantity: z.number().min(1, "Quantity must be greater than 0"),
  minStock: z.number().min(0, "Min stock cannot be negative"),
  purchaseDate: z.string().optional(),
});

/**
 * Additional validation: minStock cannot be greater than quantity.
 * This is checked separately since it depends on two fields.
 */
export function validateProductCrossFields(data) {
  const errors = {};
  if (data.minStock > data.quantity) {
    errors.minStock = "Min stock cannot be greater than quantity";
  }
  return errors;
}
