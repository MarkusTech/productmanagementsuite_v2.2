import { Request, Response, NextFunction } from "express";
import { CustomError } from "../utils/CustomError";

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    // Optionally, you can provide the error stack trace in development mode
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};
