import { z } from "zod";

export const CreatePurchaseOrderItemSchema = z.object({
  poID: z.number().int({ message: "PO ID must be an integer" }),
  itemID: z.number().int({ message: "Item ID must be an integer" }),
  uom: z.string().min(1, { message: "Unit of Measure (UOM) is required" }),
  unitCost: z
    .number()
    .positive({ message: "Unit Cost must be a positive number" }),
  orderQty: z
    .number()
    .int()
    .positive({ message: "Order Quantity must be a positive integer" }),
});

export const UpdatePurchaseOrderItemSchema = z.object({
  poID: z.number().int().optional(),
  itemID: z.number().int().optional(),
  uom: z.string().min(1).optional(),
  unitCost: z.number().positive().optional(),
  orderQty: z.number().int().positive().optional(),
});
