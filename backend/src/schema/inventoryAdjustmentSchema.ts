import { z } from "zod";

export const CreateInventoryAdjustmentSchema = z.object({
  inventoryID: z.number().int({ message: "InventoryID must be an integer" }),
  adjustmentTypeID: z
    .number()
    .int({ message: "AdjustmentTypeID must be an integer" }),
  adjustmentReasonID: z
    .number()
    .int({ message: "AdjustmentReasonID must be an integer" }),
  quantityAdjusted: z
    .number()
    .int({ message: "Quantity adjusted must be an integer" }),
  status: z.string().min(1, { message: "Status is required" }),
  createdByID: z.number().int({ message: "CreatedByID must be an integer" }),
});

export const UpdateInventoryAdjustmentSchema = z.object({
  inventoryID: z.number().int().optional(),
  adjustmentTypeID: z.number().int().optional(),
  adjustmentReasonID: z.number().int().optional(),
  quantityAdjusted: z.number().int().optional(),
  status: z.string().min(1, { message: "Status is required" }).optional(),
  modifiedByID: z.number().int().optional(),
});
