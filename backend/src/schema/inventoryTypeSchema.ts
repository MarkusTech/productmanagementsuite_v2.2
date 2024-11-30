import { z } from "zod";

export const CreateInventoryTypeSchema = z.object({
  typeName: z.string().min(1, { message: "Type name is required" }),
  description: z.string().optional(),
  status: z.boolean().optional(),
  createdByID: z.number().int({ message: "CreatedByID must be an integer" }),
});

export const UpdateInventoryTypeSchema = z.object({
  typeName: z.string().min(1, { message: "Type name is required" }).optional(),
  description: z.string().optional(),
  status: z.boolean().optional(),
  modifiedByID: z.number().int().optional(),
});
