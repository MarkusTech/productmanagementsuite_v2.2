import { z } from "zod";

export const CreatePoReceivingItemSchema = z.object({
  itemID: z.number().int({ message: "Item ID must be an integer" }),
  uom: z.string().min(1, { message: "Unit of Measure (UOM) is required" }),
  receivedQty: z
    .number()
    .int()
    .positive({ message: "Received Quantity must be a positive integer" }),
  unitCost: z
    .number()
    .positive({ message: "Unit Cost must be a positive number" }),
});

export const UpdatePoReceivingItemSchema = z.object({
  itemID: z.number().int().optional(),
  uom: z.string().min(1).optional(),
  receivedQty: z.number().int().positive().optional(),
  unitCost: z.number().positive().optional(),
});
