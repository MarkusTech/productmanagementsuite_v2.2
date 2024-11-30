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
      qty,
      price,
      paymentTypeID,
      transactionTypeID,
      transactionNumber,
      items,
    } = req.body;

    try {
      const totalPurchase: number = items.reduce(
        (total: number, item: { qty: number; price: number }) =>
          total + item.qty * item.price, // Using float arithmetic
        0
      );

      const totalItems: number = items.length;
      const totalQuantity: number = items.reduce(
        (totalQty: number, item: { qty: number }) => totalQty + item.qty,
        0
      );

      const newSalesTransaction = await prisma.salesTransaction.create({
        data: {
          locationID,
          salesTransactionCustomerID,
          qty,
          price,
          total: totalPurchase,
          totalItems,
          totalQuantity,
          totalPurchase,
          paymentTypeID,
          transactionTypeID,
          transactionNumber,
          status: "Pending", // Default status, you can change it as needed
          createdAt: new Date(),
          updatedAt: new Date(),
          salesTransactionItems: {
            create: items.map((item) => ({
              itemID: item.itemID,
              qty: item.qty,
              price: item.price,
              total: item.qty * item.price,
            })),
          },
        },
        include: {
          salesTransactionItems: true,
        },
      });

      logger.info(
        `Sales Transaction created: ID ${newSalesTransaction.salesTransactionID}`
      );

      res.status(201).json({
        success: true,
        message: "Sales transaction created successfully",
        data: newSalesTransaction,
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
      const salesTransactions = await prisma.salesTransaction.findMany({
        include: {
          salesTransactionItems: true, // Include associated sales transaction items
        },
      });

      logger.info("Fetched all sales transactions");

      res.status(200).json({
        success: true,
        data: salesTransactions,
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

  // Get sales transaction by ID
  async getSalesTransactionById(req: Request, res: Response): Promise<void> {
    const { salesTransactionID } = req.params;

    try {
      const salesTransaction = await prisma.salesTransaction.findUnique({
        where: { salesTransactionID: parseInt(salesTransactionID) },
        include: {
          salesTransactionItems: true, // Include associated sales transaction items
        },
      });

      if (!salesTransaction) {
        res.status(404).json({
          success: false,
          message: "Sales transaction not found",
        });
        return;
      }

      logger.info(`Fetched sales transaction with ID ${salesTransactionID}`);

      res.status(200).json({
        success: true,
        data: salesTransaction,
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

  // Update sales transaction
  async updateSalesTransaction(req: Request, res: Response): Promise<void> {
    const { salesTransactionID } = req.params;
    const { paymentTypeID, transactionTypeID, items } = req.body;

    try {
      // Recalculate total purchase price for the transaction (using float)
      const totalPurchase: number = items.reduce(
        (total: number, item: { qty: number; price: number }) =>
          total + item.qty * item.price,
        0
      );

      // Recalculate total items and total quantity
      const totalItems: number = items.length;
      const totalQuantity: number = items.reduce(
        (totalQty: number, item: { qty: number }) => totalQty + item.qty,
        0
      );

      // Update the sales transaction
      const updatedSalesTransaction = await prisma.salesTransaction.update({
        where: { salesTransactionID: parseInt(salesTransactionID) },
        data: {
          paymentTypeID,
          transactionTypeID,
          total: totalPurchase,
          totalItems,
          totalQuantity,
          totalPurchase, // totalPurchase is recalculated above
          updatedAt: new Date(),
          salesTransactionItems: {
            deleteMany: {}, // Optionally delete existing items before creating new ones
            create: items.map((item) => ({
              itemID: item.itemID,
              qty: item.qty,
              price: item.price,
              total: item.qty * item.price, // Calculate total per item
            })),
          },
        },
        include: {
          salesTransactionItems: true, // Include associated items in the response
        },
      });

      logger.info(`Sales Transaction updated: ID ${salesTransactionID}`);

      res.status(200).json({
        success: true,
        message: "Sales transaction updated successfully",
        data: updatedSalesTransaction,
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
}
