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
          salesTransactionID: 'desc', // Order by salesTransactionID in descending order
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
    const { items } = req.body; // Expecting an array of items

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
              total: item.total || item.qty * item.price, // Calculate total if not provided
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
}
