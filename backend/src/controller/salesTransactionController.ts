import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class SalesTransactionController {
  // Create a new sales transaction
  async createSalesTransaction(req: Request, res: Response): Promise<void> {
    const {
      locationID,
      salesTransactionCustomerID,
      paymentTypeID,
      transactionTypeID,
      transactionNumber,
      status,
      totalItems,
      totalQuantity,
      totalPurchase,
    } = req.body;

    try {
      const newTransaction = await prisma.salesTransaction.create({
        data: {
          locationID,
          salesTransactionCustomerID,
          paymentTypeID,
          transactionTypeID,
          transactionNumber,
          status,
          totalItems,
          totalQuantity,
          totalPurchase: totalPurchase || 0.0, // Defaults to 0.0 if not provided
        },
        include: {
          location: true,
          paymentType: true,
          transactionType: true,
          customer: true,
        },
      });

      logger.info(
        `Sales transaction created: ID ${newTransaction.salesTransactionID}`
      );

      res.status(201).json({
        success: true,
        message: "Sales transaction created successfully",
        data: newTransaction,
      });
    } catch (error) {
      logger.error(
        `Error creating sales transaction: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error creating sales transaction",
      });
    }
  }

  // Get all sales transactions
  async getAllSalesTransactions(req: Request, res: Response): Promise<void> {
    try {
      const transactions = await prisma.salesTransaction.findMany({
        include: {
          location: true,
          paymentType: true,
          transactionType: true,
          customer: true,
        },
      });

      logger.info("Fetched all sales transactions");

      res.status(200).json({
        success: true,
        data: transactions,
      });
    } catch (error) {
      logger.error(
        `Error fetching sales transactions: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error fetching sales transactions",
      });
    }
  }

  // Get a single sales transaction by ID
  async getSalesTransactionById(req: Request, res: Response): Promise<void> {
    const { salesTransactionID } = req.params;

    try {
      const transaction = await prisma.salesTransaction.findUnique({
        where: { salesTransactionID: parseInt(salesTransactionID) },
        include: {
          location: true,
          paymentType: true,
          transactionType: true,
          customer: true,
        },
      });

      if (!transaction) {
        res.status(404).json({
          success: false,
          message: "Sales transaction not found",
        });
        return;
      }

      logger.info(`Fetched sales transaction with ID ${salesTransactionID}`);

      res.status(200).json({
        success: true,
        data: transaction,
      });
    } catch (error) {
      logger.error(
        `Error fetching sales transaction: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error fetching sales transaction",
      });
    }
  }

  // Update a sales transaction
  async updateSalesTransaction(req: Request, res: Response): Promise<void> {
    const { salesTransactionID } = req.params;
    const {
      locationID,
      salesTransactionCustomerID,
      paymentTypeID,
      transactionTypeID,
      transactionNumber,
      transactionDate,
      status,
      totalItems,
      totalQuantity,
      totalPurchase,
    } = req.body;

    try {
      const updatedTransaction = await prisma.salesTransaction.update({
        where: { salesTransactionID: parseInt(salesTransactionID) },
        data: {
          locationID,
          salesTransactionCustomerID,
          paymentTypeID,
          transactionTypeID,
          transactionNumber,
          transactionDate,
          status,
          totalItems,
          totalQuantity,
          totalPurchase,
        },
        include: {
          location: true,
          paymentType: true,
          transactionType: true,
          customer: true,
        },
      });

      logger.info(`Sales transaction updated: ID ${salesTransactionID}`);

      res.status(200).json({
        success: true,
        message: "Sales transaction updated successfully",
        data: updatedTransaction,
      });
    } catch (error) {
      logger.error(
        `Error updating sales transaction: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error updating sales transaction",
      });
    }
  }

  // Sales Transaction Item
  async createSalesTransactionItem(req: Request, res: Response): Promise<void> {
    const { salesTransactionID, itemID, qty, price, total } = req.body;

    try {
      const newTransactionItem = await prisma.salesTransactionItems.create({
        data: {
          salesTransactionID,
          itemID,
          qty,
          price,
          total: total || qty * price, // Calculate total if not provided
        },
        include: {
          salesTransaction: true,
          item: true,
        },
      });

      logger.info(
        `Sales transaction item created: ID ${newTransactionItem.salesTransactionItemID}`
      );

      res.status(201).json({
        success: true,
        message: "Sales transaction item created successfully",
        data: newTransactionItem,
      });
    } catch (error) {
      logger.error(
        `Error creating sales transaction item: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error creating sales transaction item",
      });
    }
  }

  // Update an existing sales transaction item
  async updateSalesTransactionItem(req: Request, res: Response): Promise<void> {
    const { salesTransactionItemID } = req.params;
    const { salesTransactionID, itemID, qty, price, total } = req.body;

    try {
      const updatedTransactionItem = await prisma.salesTransactionItems.update({
        where: { salesTransactionItemID: parseInt(salesTransactionItemID) },
        data: {
          salesTransactionID,
          itemID,
          qty,
          price,
          total: total || qty * price, // Update total if not provided
        },
        include: {
          salesTransaction: true,
          item: true,
        },
      });

      logger.info(
        `Sales transaction item updated: ID ${salesTransactionItemID}`
      );

      res.status(200).json({
        success: true,
        message: "Sales transaction item updated successfully",
        data: updatedTransactionItem,
      });
    } catch (error) {
      logger.error(
        `Error updating sales transaction item: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error updating sales transaction item",
      });
    }
  }
}
