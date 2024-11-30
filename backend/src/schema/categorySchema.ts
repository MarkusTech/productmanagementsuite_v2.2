import { z } from "zod";

// Zod schema for creating a new category
export const CreateCategorySchema = z.object({
  categoryCode: z
    .string()
    .min(1, "Category code is required")
    .max(50, "Category code must not exceed 50 characters"),

  categoryName: z
    .string()
    .min(1, "Category name is required")
    .max(100, "Category name must not exceed 100 characters"),

  description: z
    .string()
    .max(255, "Description must not exceed 255 characters")
    .optional(), // Optional field for description

  status: z.boolean().optional(), // Optional boolean for status
});

// Zod schema for updating an existing category
export const UpdateCategorySchema = z.object({
  categoryCode: z
    .string()
    .max(50, "Category code must not exceed 50 characters")
    .optional(), // Optional field for category code

  categoryName: z
    .string()
    .max(100, "Category name must not exceed 100 characters")
    .optional(), // Optional field for category name

  description: z
    .string()
    .max(255, "Description must not exceed 255 characters")
    .optional(), // Optional field for description

  status: z.boolean().optional(), // Optional boolean for status
});
