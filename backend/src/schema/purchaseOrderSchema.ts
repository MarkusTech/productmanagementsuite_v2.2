import { z } from "zod";

export const CreatePurchaseOrderSchema = z.object({
  poNumber: z.number().int({ message: "PO Number must be an integer" }),
  supplierID: z.number().int({ message: "Supplier ID must be an integer" }),
  orderDate: z.date({ message: "Order date is required" }),
  expectedDeliverDate: z.date({
    message: "Expected delivery date is required",
  }),
  status: z.string().min(1, { message: "Status is required" }),
  locationID: z.number().int({ message: "Location ID must be an integer" }),
  createdByID: z.number().int({ message: "Created By ID must be an integer" }),
  modifiedByID: z.number().int().optional(),
});

export const UpdatePurchaseOrderSchema = z.object({
  poNumber: z.number().int().optional(),
  supplierID: z.number().int().optional(),
  orderDate: z.date().optional(),
  expectedDeliverDate: z.date().optional(),
  status: z.string().min(1).optional(),
  locationID: z.number().int().optional(),
  modifiedByID: z.number().int().optional(),
});
