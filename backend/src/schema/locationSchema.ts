import { z } from "zod";

// Zod schema for creating a new location
export const CreateLocationSchema = z.object({
  locationName: z
    .string()
    .min(1, "Location name is required")
    .max(100, "Location name must not exceed 100 characters"),

  description: z
    .string()
    .max(255, "Description must not exceed 255 characters")
    .optional(), // Optional field for description

  createdByID: z
    .number()
    .int("CreatedByID must be an integer")
    .min(1, "CreatedByID must be greater than 0"), // Ensure it's a positive integer

  modifiedByID: z
    .number()
    .int("ModifiedByID must be an integer")
    .min(1, "ModifiedByID must be greater than 0"), // Ensure it's a positive integer

  status: z.boolean().optional(), // Optional boolean for status
});

// Zod schema for updating an existing location
export const UpdateLocationSchema = z.object({
  locationName: z
    .string()
    .min(1, "Location name is required")
    .max(100, "Location name must not exceed 100 characters")
    .optional(), // Optional field for location name

  description: z
    .string()
    .max(255, "Description must not exceed 255 characters")
    .optional(), // Optional field for description

  createdByID: z
    .number()
    .int("CreatedByID must be an integer")
    .min(1, "CreatedByID must be greater than 0")
    .optional(), // Optional field for createdByID

  modifiedByID: z
    .number()
    .int("ModifiedByID must be an integer")
    .min(1, "ModifiedByID must be greater than 0")
    .optional(), // Optional field for modifiedByID

  status: z.boolean().optional(), // Optional boolean for status
});
