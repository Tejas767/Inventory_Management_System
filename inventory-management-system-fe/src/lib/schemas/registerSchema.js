/**
 * ============================================================
 * REGISTER SCHEMA — Zod validation for registration form
 * ============================================================
 */

import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});
