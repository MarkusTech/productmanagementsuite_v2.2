import { z } from "zod";

// Zod schema for creating a new item
export const CreateItemSchema = z.object({
  itemCode: z
    .string()
    .min(1, "Item code is required")
    .max(50, "Item code must not exceed 50 characters"),

  categoryID: z
    .number()
    .int("Category ID must be an integer")
    .positive("Category ID must be a positive number"),

  barcode: z
    .string()
    .min(1, "Barcode is required")
    .max(100, "Barcode must not exceed 100 characters"),

  itemName: z
    .string()
    .min(1, "Item name is required")
    .max(100, "Item name must not exceed 100 characters"),

  description: z
    .string()
    .max(255, "Description must not exceed 255 characters")
    .optional(), // Optional field for description

  grams: z.number().positive("Grams must be a positive number"),

  uom: z
    .string()
    .min(1, "Unit of Measure (UOM) is required")
    .max(20, "UOM must not exceed 20 characters"),

  price: z.number().positive("Price must be a positive number"),

  cost: z.number().positive("Cost must be a positive number"),

  image_url: z.string().url("Image URL must be a valid URL").optional(), // Optional field for image URL

  createdByID: z
    .number()
    .int("Created By ID must be an integer")
    .positive("Created By ID must be a positive number"),

  modifiedByID: z
    .number()
    .int("Modified By ID must be an integer")
    .positive("Modified By ID must be a positive number")
    .optional(), // Optional field for modified by ID

  status: z.boolean().optional(), // Optional boolean for status
});

// Zod schema for updating an existing item
export const UpdateItemSchema = z.object({
  itemCode: z
    .string()
    .min(1, "Item code is required")
    .max(50, "Item code must not exceed 50 characters")
    .optional(), // Optional field for item code

  categoryID: z
    .number()
    .int("Category ID must be an integer")
    .positive("Category ID must be a positive number")
    .optional(), // Optional field for category ID

  barcode: z
    .string()
    .min(1, "Barcode is required")
    .max(100, "Barcode must not exceed 100 characters")
    .optional(), // Optional field for barcode

  itemName: z
    .string()
    .min(1, "Item name is required")
    .max(100, "Item name must not exceed 100 characters")
    .optional(), // Optional field for item name

  description: z
    .string()
    .max(255, "Description must not exceed 255 characters")
    .optional(), // Optional field for description

  grams: z.number().positive("Grams must be a positive number").optional(), // Optional field for grams

  uom: z
    .string()
    .min(1, "Unit of Measure (UOM) is required")
    .max(20, "UOM must not exceed 20 characters")
    .optional(), // Optional field for UOM

  price: z.number().positive("Price must be a positive number").optional(), // Optional field for price

  cost: z.number().positive("Cost must be a positive number").optional(), // Optional field for cost

  image_url: z.string().url("Image URL must be a valid URL").optional(), // Optional field for image URL

  createdByID: z
    .number()
    .int("Created By ID must be an integer")
    .positive("Created By ID must be a positive number")
    .optional(), // Optional field for created by ID

  modifiedByID: z
    .number()
    .int("Modified By ID must be an integer")
    .positive("Modified By ID must be a positive number")
    .optional(), // Optional field for modified by ID

  status: z.boolean().optional(), // Optional boolean for status
});
