import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class AuthController {
  // Login method
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    try {
      // Find the user by email
      const user = await prisma.users.findUnique({
        where: { email },
      });

      if (!user) {
        logger.warn(`Login attempt failed: User not found for email ${email}`);
        res.status(400).json({ error: "User not found" });
        return;
      }

      // Check if the password is correct
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        logger.warn(
          `Login attempt failed: Invalid password for email ${email}`
        );
        res.status(400).json({ error: "Invalid password" });
        return;
      }

      // Generate a JWT token
      const token = jwt.sign(
        { userID: user.userID, email: user.email, roleID: user.roleID },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      logger.info(`User with email ${email} logged in successfully`);

      // Send the token back in the response
      res.status(200).json({ token, roleID: user.roleID, userID: user.userID });
    } catch (error) {
      logger.error(
        `Login error for email ${email}: ${(error as Error).message}`
      );
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Login failed" });
      }
    }
  }

  // Logout method
  logout(req: Request, res: Response): void {
    logger.info("User logged out successfully");
    res.status(200).json({ message: "Logged out successfully" });
  }
}
