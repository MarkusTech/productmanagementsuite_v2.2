import { z } from "zod";

export const CreateAdjustmentTypeSchema = z.object({
  typeName: z.string().min(1, { message: "Type name is required" }),
  createdByID: z.number().int({ message: "CreatedByID must be an integer" }),
});

export const UpdateAdjustmentTypeSchema = z.object({
  typeName: z.string().min(1, { message: "Type name is required" }).optional(),
  modifiedByID: z.number().int().optional(),
});
