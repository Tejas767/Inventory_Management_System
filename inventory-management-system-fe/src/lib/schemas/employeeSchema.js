/**
 * ============================================================
 * EMPLOYEE SCHEMA — Zod validation for employee forms
 * ============================================================
 */

import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Enter a valid email address"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  joiningDate: z.string().refine(
    (date) => new Date(date) <= new Date(),
    { message: "Joining date cannot be in the future" }
  ),
});
