import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class PaymentTypeController {
  // Create a new payment type
  async createPaymentType(req: Request, res: Response): Promise<void> {
    const { paymentName, description, createdByID, modifiedByID } = req.body;

    try {
      const newPaymentType = await prisma.paymentType.create({
        data: {
          paymentName,
          description, // Include the description field
          createdByID,
          modifiedByID,
        },
      });

      logger.info(`Payment Type created: ID ${newPaymentType.paymentTypeID}`);

      res.status(201).json({
        success: true,
        message: "Payment type created successfully",
        data: newPaymentType,
      });
    } catch (error) {
      logger.error(`Error creating payment type: ${(error as Error).message}`);
      res.status(500).json({
        success: false,
        message: "Error creating payment type",
      });
    }
  }

  // Get all payment types
  async getAllPaymentTypes(req: Request, res: Response): Promise<void> {
    try {
      const paymentTypes = await prisma.paymentType.findMany({
        include: {
          salesTransactions: true, // Include associated sales transactions
        },
      });

      logger.info("Fetched all payment types");

      res.status(200).json({
        success: true,
        data: paymentTypes,
      });
    } catch (error) {
      logger.error(`Error fetching payment types: ${(error as Error).message}`);
      res.status(500).json({
        success: false,
        message: "Error fetching payment types",
      });
    }
  }

  // Get payment type by ID
  async getPaymentTypeById(req: Request, res: Response): Promise<void> {
    const { paymentTypeID } = req.params;

    try {
      const paymentType = await prisma.paymentType.findUnique({
        where: { paymentTypeID: parseInt(paymentTypeID) },
        include: {
          salesTransactions: true, // Include associated sales transactions
        },
      });

      if (!paymentType) {
        res.status(404).json({
          success: false,
          message: "Payment type not found",
        });
        return;
      }

      logger.info(`Fetched payment type with ID ${paymentTypeID}`);

      res.status(200).json({
        success: true,
        data: paymentType,
      });
    } catch (error) {
      logger.error(`Error fetching payment type: ${(error as Error).message}`);
      res.status(500).json({
        success: false,
        message: "Error fetching payment type",
      });
    }
  }

  // Update payment type
  async updatePaymentType(req: Request, res: Response): Promise<void> {
    const { paymentTypeID } = req.params;
    const { paymentName, description, modifiedByID } = req.body;

    try {
      const updatedPaymentType = await prisma.paymentType.update({
        where: { paymentTypeID: parseInt(paymentTypeID) },
        data: {
          paymentName,
          description, // Include description in the update
          modifiedByID,
        },
      });

      logger.info(`Payment Type updated: ID ${paymentTypeID}`);

      res.status(200).json({
        success: true,
        message: "Payment type updated successfully",
        data: updatedPaymentType,
      });
    } catch (error) {
      logger.error(`Error updating payment type: ${(error as Error).message}`);
      res.status(500).json({
        success: false,
        message: "Error updating payment type",
      });
    }
  }
}
