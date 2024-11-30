import { z } from "zod";

// Zod schema for creating a new supplier
export const CreateSupplierSchema = z.object({
  supplierName: z
    .string()
    .min(1, "Supplier name is required")
    .max(100, "Supplier name must not exceed 100 characters"),

  description: z
    .string()
    .max(255, "Description must not exceed 255 characters")
    .optional(), // Optional field for description

  status: z.boolean().optional(), // Optional boolean for status
});

// Zod schema for updating an existing supplier
export const UpdateSupplierSchema = z.object({
  supplierName: z
    .string()
    .min(1, "Supplier name is required")
    .max(100, "Supplier name must not exceed 100 characters")
    .optional(), // Optional field for supplier name

  description: z
    .string()
    .max(255, "Description must not exceed 255 characters")
    .optional(), // Optional field for description

  status: z.boolean().optional(), // Optional boolean for status
});
