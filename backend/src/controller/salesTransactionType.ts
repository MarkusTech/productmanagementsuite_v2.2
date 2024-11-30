import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class TransactionTypeController {
  // Create a new transaction type
  async createTransactionType(req: Request, res: Response): Promise<void> {
    const { transactionName, description, createdByID, modifiedByID } =
      req.body;

    try {
      const newTransactionType = await prisma.transactionType.create({
        data: {
          transactionName,
          description, // Include the description field
          createdByID,
          modifiedByID,
        },
      });

      logger.info(
        `Transaction Type created: ID ${newTransactionType.transactionTypeID}`
      );

      res.status(201).json({
        success: true,
        message: "Transaction type created successfully",
        data: newTransactionType,
      });
    } catch (error) {
      logger.error(
        `Error creating transaction type: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error creating transaction type",
      });
    }
  }

  // Get all transaction types
  async getAllTransactionTypes(req: Request, res: Response): Promise<void> {
    try {
      const transactionTypes = await prisma.transactionType.findMany({
        include: {
          salesTransactions: true, // Include associated sales transactions
        },
      });

      logger.info("Fetched all transaction types");

      res.status(200).json({
        success: true,
        data: transactionTypes,
      });
    } catch (error) {
      logger.error(
        `Error fetching transaction types: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error fetching transaction types",
      });
    }
  }

  // Get transaction type by ID
  async getTransactionTypeById(req: Request, res: Response): Promise<void> {
    const { transactionTypeID } = req.params;

    try {
      const transactionType = await prisma.transactionType.findUnique({
        where: { transactionTypeID: parseInt(transactionTypeID) },
        include: {
          salesTransactions: true, // Include associated sales transactions
        },
      });

      if (!transactionType) {
        res.status(404).json({
          success: false,
          message: "Transaction type not found",
        });
        return;
      }

      logger.info(`Fetched transaction type with ID ${transactionTypeID}`);

      res.status(200).json({
        success: true,
        data: transactionType,
      });
    } catch (error) {
      logger.error(
        `Error fetching transaction type: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error fetching transaction type",
      });
    }
  }

  // Update transaction type
  async updateTransactionType(req: Request, res: Response): Promise<void> {
    const { transactionTypeID } = req.params;
    const { transactionName, description, modifiedByID } = req.body;

    try {
      const updatedTransactionType = await prisma.transactionType.update({
        where: { transactionTypeID: parseInt(transactionTypeID) },
        data: {
          transactionName,
          description, // Include description in the update
          modifiedByID,
        },
      });

      logger.info(`Transaction Type updated: ID ${transactionTypeID}`);

      res.status(200).json({
        success: true,
        message: "Transaction type updated successfully",
        data: updatedTransactionType,
      });
    } catch (error) {
      logger.error(
        `Error updating transaction type: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error updating transaction type",
      });
    }
  }
}
