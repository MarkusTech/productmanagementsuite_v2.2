import { z } from "zod";

export const CreateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  roleID: z.number().int("Role ID must be an integer"),
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  birthday: z.string().optional(),
  createdByID: z.number().int("Created By ID must be an integer"),
  modifiedByID: z.number().int("Modified By ID must be an integer"),
  image_url: z.string().optional(),
});

export const UpdateUserSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  roleID: z.number().optional(),
  username: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  birthday: z.string().optional(),
  status: z.boolean().optional(),
  image_url: z.string().optional(),
  modifiedByID: z.number().int("Modified By ID must be an integer").optional(),
});
