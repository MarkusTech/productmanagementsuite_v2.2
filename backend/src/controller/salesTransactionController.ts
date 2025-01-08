import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class SalesTransactionController {
  // Create a new sales transaction
  async createSalesTransaction(req: Request, res: Response): Promise<void> {
    const {
      locationID,
      customerID,
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
          customerID,
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
          salesTransactionItems: {
            include: {
              item: true, // Optionally, include the associated item details (if needed)
            },
          },
        },
        orderBy: {
          salesTransactionID: "desc", // Order by salesTransactionID in descending order
        },
      });

      logger.info("Fetched all sales transactions with items");

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
          salesTransactionItems: {
            include: {
              item: true, // Include associated item details
            },
          },
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
      customerID,
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
          customerID,
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
  async createSalesTransactionItems(
    req: Request,
    res: Response
  ): Promise<void> {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        message: "Invalid input. Provide an array of items.",
      });
      return;
    }

    try {
      const createdItems = await prisma.$transaction(
        items.map((item) =>
          prisma.salesTransactionItems.create({
            data: {
              salesTransactionID: item.salesTransactionID,
              itemID: item.itemID,
              qty: item.qty,
              price: item.price,
              total: item.total || item.qty * item.price,
            },
            include: {
              salesTransaction: true,
              item: true,
            },
          })
        )
      );

      logger.info(`Created ${createdItems.length} sales transaction items.`);

      res.status(201).json({
        success: true,
        message: "Sales transaction items created successfully.",
        data: createdItems,
      });
    } catch (error) {
      logger.error(
        `Error creating sales transaction items: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error creating sales transaction items.",
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

  // Sales Cutomers
  async saveSalesTransactionCustomer(
    req: Request,
    res: Response
  ): Promise<void> {
    const {
      firstName,
      middleName,
      lastName,
      contactNo,
      address,
      email,
      customerTypeID,
      createdByID,
    } = req.body;

    try {
      const newCustomer = await prisma.customers.create({
        data: {
          firstName,
          middleName,
          lastName,
          contactNo,
          address,
          email,
          customerTypeID,
          createdByID,
        },
      });

      logger.info(`Customer created: ID ${newCustomer.customerID}`);

      res.status(201).json({
        success: true,
        message: "Customer created successfully",
        data: newCustomer,
      });
    } catch (error) {
      logger.error(`Error creating customer: ${(error as Error).message}`);
      res.status(500).json({
        success: false,
        message: "Error creating customer",
      });
    }
  }

  // Update an existing sales transaction customer
  async updateSalesTransactionCustomer(
    req: Request,
    res: Response
  ): Promise<void> {
    const { customerID } = req.params;
    const {
      firstName,
      middleName,
      lastName,
      contactNo,
      address,
      email,
      customerTypeID,
      modifiedByID,
    } = req.body;

    try {
      const updatedCustomer = await prisma.customers.update({
        where: {
          customerID: parseInt(customerID),
        },
        data: {
          firstName,
          middleName,
          lastName,
          contactNo,
          address,
          email,
          customerTypeID,
          modifiedByID,
        },
      });

      logger.info(`Customer updated: ID ${customerID}`);

      res.status(200).json({
        success: true,
        message: "Customer updated successfully",
        data: updatedCustomer,
      });
    } catch (error) {
      logger.error(`Error updating customer: ${(error as Error).message}`);
      res.status(500).json({
        success: false,
        message: "Error updating customer",
      });
    }
  }

  async deleteSalesTransaction(req: Request, res: Response): Promise<void> {
    const { salesTransactionID } = req.params;

    try {
      // Check if the transaction exists
      const transaction = await prisma.salesTransaction.findUnique({
        where: { salesTransactionID: parseInt(salesTransactionID) },
      });

      if (!transaction) {
        logger.warn(`Transaction not found: ID ${salesTransactionID}`);
        res.status(404).json({
          success: false,
          message: "Sales transaction not found.",
        });
        return;
      }

      // Use a transaction to delete salesTransactionItems and salesTransaction
      await prisma.$transaction([
        prisma.salesTransactionItems.deleteMany({
          where: { salesTransactionID: parseInt(salesTransactionID) },
        }),
        prisma.salesTransaction.delete({
          where: { salesTransactionID: parseInt(salesTransactionID) },
        }),
      ]);

      logger.info(
        `Deleted sales transaction and related items: ID ${salesTransactionID}`
      );

      res.status(200).json({
        success: true,
        message: "Sales transaction and related items deleted successfully.",
      });
    } catch (error) {
      logger.error(
        `Error deleting sales transaction: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error deleting sales transaction.",
      });
    }
  }

  async voidSalesTransaction(req: Request, res: Response): Promise<void> {
    const { salesTransactionID } = req.params; // Extract salesTransactionID from URL

    if (!salesTransactionID) {
      res.status(400).json({
        success: false,
        message: "Invalid input. Provide a valid salesTransactionID.",
      });
      return;
    }

    try {
      // Update the status of the sales transaction to 'Voided'
      const updatedTransaction = await prisma.salesTransaction.update({
        where: {
          salesTransactionID: Number(salesTransactionID), // Ensure ID is a number
        },
        data: {
          status: "Voided", // Set the transaction status to 'Voided'
        },
      });

      if (!updatedTransaction) {
        res.status(404).json({
          success: false,
          message: "Sales transaction not found or invalid salesTransactionID.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Sales transaction voided successfully.",
      });
    } catch (error) {
      console.error("Error voiding sales transaction:", error);
      res.status(500).json({
        success: false,
        message: "Error voiding sales transaction.",
      });
    }
  }
}
