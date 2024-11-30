import { Request, Response, NextFunction } from "express";

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { role } = req.user; // Assuming user role is stored in the decoded token
  if (role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
