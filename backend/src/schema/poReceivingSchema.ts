import { z } from "zod";

export const CreatePoReceivingSchema = z.object({
  poID: z.number().int({ message: "Purchase Order ID must be an integer" }),
  receivedDate: z.date({ message: "Received Date must be a valid date" }),
  referenceNumber: z
    .string()
    .min(1, { message: "Reference Number is required" }),
  totalCost: z
    .number()
    .positive({ message: "Total Cost must be a positive number" }),
  totalQty: z
    .number()
    .int()
    .positive({ message: "Total Quantity must be a positive integer" }),
  status: z.string().min(1, { message: "Status is required" }),
  receivedByID: z
    .number()
    .int({ message: "Received By ID must be an integer" }),
});

export const UpdatePoReceivingSchema = z.object({
  poID: z.number().int().optional(),
  receivedDate: z.date().optional(),
  referenceNumber: z.string().min(1).optional(),
  totalCost: z.number().positive().optional(),
  totalQty: z.number().int().positive().optional(),
  status: z.string().min(1).optional(),
  receivedByID: z.number().int().optional(),
});
