import { z } from "zod";

export const CreateAdjustmentReasonSchema = z.object({
  reasonName: z.string().min(1, { message: "Reason name is required" }),
  createdByID: z.number().int({ message: "CreatedByID must be an integer" }),
});

export const UpdateAdjustmentReasonSchema = z.object({
  reasonName: z
    .string()
    .min(1, { message: "Reason name is required" })
    .optional(),
  modifiedByID: z.number().int().optional(),
});
