import { z } from "zod";

// Zod schema for creating a new inventory record
export const CreateInventorySchema = z.object({
  locationID: z
    .number()
    .int("Location ID must be an integer")
    .positive("Location ID must be a positive number"),

  itemID: z
    .number()
    .int("Item ID must be an integer")
    .positive("Item ID must be a positive number"),

  quantity: z
    .number()
    .int("Quantity must be an integer")
    .nonnegative("Quantity cannot be negative"),

  inventoryTypeID: z
    .number()
    .int("Inventory Type ID must be an integer")
    .positive("Inventory Type ID must be a positive number"),

  reOrderThreshold: z
    .string()
    .min(1, "Reorder Threshold is required")
    .max(50, "Reorder Threshold must not exceed 50 characters"),

  createdAt: z.date().optional(), // Optional field for createdAt
  updatedAt: z.date().optional(), // Optional field for updatedAt
});

// Zod schema for updating an existing inventory record
export const UpdateInventorySchema = z.object({
  locationID: z
    .number()
    .int("Location ID must be an integer")
    .positive("Location ID must be a positive number")
    .optional(), // Optional field for location ID

  itemID: z
    .number()
    .int("Item ID must be an integer")
    .positive("Item ID must be a positive number")
    .optional(), // Optional field for item ID

  quantity: z
    .number()
    .int("Quantity must be an integer")
    .nonnegative("Quantity cannot be negative")
    .optional(), // Optional field for quantity

  inventoryTypeID: z
    .number()
    .int("Inventory Type ID must be an integer")
    .positive("Inventory Type ID must be a positive number")
    .optional(), // Optional field for inventory type ID

  reOrderThreshold: z
    .string()
    .min(1, "Reorder Threshold is required")
    .max(50, "Reorder Threshold must not exceed 50 characters")
    .optional(), // Optional field for reorder threshold

  createdAt: z.date().optional(), // Optional field for createdAt
  updatedAt: z.date().optional(), // Optional field for updatedAt
});
