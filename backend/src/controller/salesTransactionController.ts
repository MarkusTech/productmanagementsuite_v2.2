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
      items, // items is expected to be an array of salesTransactionItems
    } = req.body;

    try {
      // Calculate totals for the transaction
      const totalPurchase: number = items.reduce(
        (total: number, item: { qty: number; price: number }) =>
          total + item.qty * item.price, // Calculate total for each item
        0
      );

      const totalItems: number = items.length;
      const totalQuantity: number = items.reduce(
        (totalQty: number, item: { qty: number }) => totalQty + item.qty,
        0
      );

      // Create the sales transaction along with related items
      const newSalesTransaction = await prisma.salesTransaction.create({
        data: {
          locationID,
          salesTransactionCustomerID,
          paymentTypeID,
          transactionTypeID,
          transactionNumber,
          totalItems,
          totalQuantity,
          totalPurchase, // Main total for the transaction
          status: "Pending", // Default status
          createdAt: new Date(),
          updatedAt: new Date(),
          salesTransactionItems: {
            create: items.map(
              (item: { itemID: number; qty: number; price: number }) => ({
                itemID: item.itemID,
                qty: item.qty,
                price: item.price,
                total: item.qty * item.price, // Calculate total for each item
              })
            ),
          },
          location: {
            connect: { locationID }, // Connect the location to the transaction
          },
          paymentType: {
            connect: { paymentTypeID }, // Connect the payment type to the transaction
          },
          transactionType: {
            connect: { transactionTypeID }, // Connect the transaction type to the transaction
          },
          customer: {
            connect: { salesTransactionCustomerID }, // Connect the customer to the transaction
          },
        },
        include: {
          salesTransactionItems: true, // Include associated sales transaction items
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

  // Get a sales transaction by ID
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
}
