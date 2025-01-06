import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import logger from "../utils/logger";
import { startOfDay, startOfWeek, startOfMonth, endOfDay } from "date-fns";

const prisma = new PrismaClient();

export class SalesReportController {
  // Get daily sales report
  async getDailySalesReport(req: Request, res: Response): Promise<void> {
    const { date } = req.query;

    try {
      const reportDate = date ? new Date(date as string) : new Date();
      const startOfDayDate = startOfDay(reportDate);
      const endOfDayDate = endOfDay(reportDate);

      const transactions = await prisma.salesTransaction.findMany({
        where: {
          transactionDate: {
            gte: startOfDayDate,
            lte: endOfDayDate,
          },
        },
        include: {
          salesTransactionItems: {
            include: {
              item: true, // Include the item details to access price and cost
            },
          },
        },
      });

      if (!transactions || transactions.length === 0) {
        logger.warn("No sales transactions found for the given date");
        res.status(404).json({
          success: false,
          message: "No sales transactions found for the given date.",
        });
        return;
      }

      // Calculate totals
      let totalSales = 0;
      let totalItemsSold = 0;
      let totalPurchases = 0;
      let totalProfit = 0;

      transactions.forEach((transaction) => {
        totalSales += transaction.totalPurchase;
        totalItemsSold += transaction.salesTransactionItems.reduce(
          (itemSum, item) => itemSum + item.qty,
          0
        );
        totalPurchases += transaction.totalPurchase;

        // Calculate profit for the transaction
        transaction.salesTransactionItems.forEach((item) => {
          const itemProfit = (item.price - item.item.cost) * item.qty;
          totalProfit += itemProfit; // Sum up the profit for all items sold
        });
      });

      logger.info("Fetched daily sales transactions report");
      res.status(200).json({
        success: true,
        data: transactions,
        totals: {
          totalSales,
          totalItemsSold,
          totalPurchases,
          totalProfit, // Include total profit in the response
        },
      });
    } catch (error) {
      logger.error(
        `Error fetching daily sales report: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error fetching daily sales report.",
      });
    }
  }

  // Get weekly sales report
  async getWeeklySalesReport(req: Request, res: Response): Promise<void> {
    const { date } = req.query;

    try {
      const reportDate = date ? new Date(date as string) : new Date();
      const startOfWeekDate = startOfWeek(reportDate);
      const endOfWeekDate = endOfDay(reportDate); // End of the current week

      const transactions = await prisma.salesTransaction.findMany({
        where: {
          transactionDate: {
            gte: startOfWeekDate,
            lte: endOfWeekDate,
          },
        },
        include: {
          salesTransactionItems: {
            include: {
              item: true, // Include the item details to access price and cost
            },
          },
        },
      });

      if (!transactions || transactions.length === 0) {
        logger.warn("No sales transactions found for the given week");
        res.status(404).json({
          success: false,
          message: "No sales transactions found for the given week.",
        });
        return;
      }

      // Calculate totals
      let totalSales = 0;
      let totalItemsSold = 0;
      let totalPurchases = 0;
      let totalProfit = 0;

      transactions.forEach((transaction) => {
        totalSales += transaction.totalPurchase;
        totalItemsSold += transaction.salesTransactionItems.reduce(
          (itemSum, item) => itemSum + item.qty,
          0
        );
        totalPurchases += transaction.totalPurchase;

        // Calculate profit for the transaction
        transaction.salesTransactionItems.forEach((item) => {
          const itemProfit = (item.price - item.item.cost) * item.qty;
          totalProfit += itemProfit; // Sum up the profit for all items sold
        });
      });

      logger.info("Fetched weekly sales transactions report");
      res.status(200).json({
        success: true,
        data: transactions,
        totals: {
          totalSales,
          totalItemsSold,
          totalPurchases,
          totalProfit, // Include total profit in the response
        },
      });
    } catch (error) {
      logger.error(
        `Error fetching weekly sales report: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error fetching weekly sales report.",
      });
    }
  }

  // Get monthly sales report
  async getMonthlySalesReport(req: Request, res: Response): Promise<void> {
    const { date } = req.query;

    try {
      const reportDate = date ? new Date(date as string) : new Date();
      const startOfMonthDate = startOfMonth(reportDate);
      const endOfMonthDate = endOfDay(reportDate); // End of the current month

      const transactions = await prisma.salesTransaction.findMany({
        where: {
          transactionDate: {
            gte: startOfMonthDate,
            lte: endOfMonthDate,
          },
        },
        include: {
          salesTransactionItems: {
            include: {
              item: true, // Include the item details to access price and cost
            },
          },
        },
      });

      if (!transactions || transactions.length === 0) {
        logger.warn("No sales transactions found for the given month");
        res.status(404).json({
          success: false,
          message: "No sales transactions found for the given month.",
        });
        return;
      }

      // Calculate totals
      let totalSales = 0;
      let totalItemsSold = 0;
      let totalPurchases = 0;
      let totalProfit = 0;

      transactions.forEach((transaction) => {
        totalSales += transaction.totalPurchase;
        totalItemsSold += transaction.salesTransactionItems.reduce(
          (itemSum, item) => itemSum + item.qty,
          0
        );
        totalPurchases += transaction.totalPurchase;

        // Calculate profit for the transaction
        transaction.salesTransactionItems.forEach((item) => {
          const itemProfit = (item.price - item.item.cost) * item.qty;
          totalProfit += itemProfit; // Sum up the profit for all items sold
        });
      });

      logger.info("Fetched monthly sales transactions report");
      res.status(200).json({
        success: true,
        data: transactions,
        totals: {
          totalSales,
          totalItemsSold,
          totalPurchases,
          totalProfit, // Include total profit in the response
        },
      });
    } catch (error) {
      logger.error(
        `Error fetching monthly sales report: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error fetching monthly sales report.",
      });
    }
  }

  // Get annually sales report
  async getAnnuallySalesReport(req: Request, res: Response): Promise<void> {
    const { date } = req.query;

    try {
      const reportDate = date ? new Date(date as string) : new Date();
      const startOfYearDate = new Date(reportDate.getFullYear(), 0, 1); // Start of the year
      const endOfYearDate = new Date(
        reportDate.getFullYear(),
        11,
        31,
        23,
        59,
        59
      ); // End of the year

      const transactions = await prisma.salesTransaction.findMany({
        where: {
          transactionDate: {
            gte: startOfYearDate,
            lte: endOfYearDate,
          },
        },
        include: {
          salesTransactionItems: {
            include: {
              item: true, // Include the item details to access price and cost
            },
          },
        },
      });

      if (!transactions || transactions.length === 0) {
        logger.warn("No sales transactions found for the given year");
        res.status(404).json({
          success: false,
          message: "No sales transactions found for the given year.",
        });
        return;
      }

      // Calculate totals
      let totalSales = 0;
      let totalItemsSold = 0;
      let totalPurchases = 0;
      let totalProfit = 0;

      transactions.forEach((transaction) => {
        totalSales += transaction.totalPurchase;
        totalItemsSold += transaction.salesTransactionItems.reduce(
          (itemSum, item) => itemSum + item.qty,
          0
        );
        totalPurchases += transaction.totalPurchase;

        // Calculate profit for the transaction
        transaction.salesTransactionItems.forEach((item) => {
          const itemProfit = (item.price - item.item.cost) * item.qty;
          totalProfit += itemProfit; // Sum up the profit for all items sold
        });
      });

      logger.info("Fetched annual sales transactions report");
      res.status(200).json({
        success: true,
        data: transactions,
        totals: {
          totalSales,
          totalItemsSold,
          totalPurchases,
          totalProfit, // Include total profit in the response
        },
      });
    } catch (error) {
      logger.error(
        `Error fetching annual sales report: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error fetching annual sales report.",
      });
    }
  }

  // Get total sales from all transactions
  async getTotalSales(req: Request, res: Response): Promise<void> {
    try {
      // Calculate the sum of totalPurchase from all sales transactions
      const totalSales = await prisma.salesTransaction.aggregate({
        _sum: {
          totalPurchase: true,
        },
      });

      // If no transactions exist, totalSales will be null
      if (!totalSales._sum.totalPurchase) {
        res.status(404).json({
          success: false,
          message: "No sales transactions found.",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          totalSales: totalSales._sum.totalPurchase,
        },
      });
    } catch (error) {
      console.error("Error fetching total sales:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching total sales.",
      });
    }
  }

  // Get total count of completed sales transactions
  async getCompletedSalesCount(req: Request, res: Response): Promise<void> {
    try {
      const completedCount = await prisma.salesTransaction.count({
        where: {
          status: "Completed",
        },
      });

      res.status(200).json({
        success: true,
        data: {
          completedSalesCount: completedCount,
        },
      });
    } catch (error) {
      logger.error(
        `Error fetching completed sales count: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error fetching completed sales count.",
      });
    }
  }

  // Get transaction summary with customerName (constructed from firstName, middleName, lastName), createdAt, and status
  async getTransactionSummary(req: Request, res: Response): Promise<void> {
    try {
      const transactions = await prisma.salesTransaction.findMany({
        select: {
          customer: {
            select: {
              firstName: true,
              middleName: true,
              lastName: true,
            },
          },
          createdAt: true,
          status: true,
        },
      });

      if (!transactions || transactions.length === 0) {
        logger.warn("No sales transactions found.");
        res.status(404).json({
          success: false,
          message: "No sales transactions found.",
        });
        return;
      }

      // Construct the customerName by concatenating firstName, middleName, and lastName
      const transactionSummaries = transactions.map((transaction) => ({
        customerName: `${transaction.customer.firstName} ${
          transaction.customer.middleName
            ? transaction.customer.middleName + " "
            : ""
        }${transaction.customer.lastName}`,
        createdAt: transaction.createdAt,
        status: transaction.status,
      }));

      logger.info("Fetched transaction summary");
      res.status(200).json({
        success: true,
        data: transactionSummaries,
      });
    } catch (error) {
      logger.error(
        `Error fetching transaction summary: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error fetching transaction summary.",
      });
    }
  }
}
