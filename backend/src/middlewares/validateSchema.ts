import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateSchema =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: error.errors,
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "An unexpected error occurred during validation",
        });
      }
    }
  };
