import { z } from "zod";

export const CreatePoSupplierSchema = z.object({
  supplierName: z.string().min(1, { message: "Supplier Name is required" }),
  contactDetails: z
    .string()
    .min(1, { message: "Contact Details are required" }),
  address: z.string().min(1, { message: "Address is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  createdByID: z.number().int({ message: "Created By ID must be an integer" }),
  modifiedByID: z.number().int().optional(),
  status: z.boolean().optional(),
});

export const UpdatePoSupplierSchema = z.object({
  supplierName: z.string().min(1).optional(),
  contactDetails: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  email: z.string().email().optional(),
  createdByID: z.number().int().optional(),
  modifiedByID: z.number().int().optional(),
  status: z.boolean().optional(),
});
