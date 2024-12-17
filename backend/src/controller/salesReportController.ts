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
          customer: true,
          location: true,
          paymentType: true,
          transactionType: true,
          salesTransactionItems: {
            include: {
              item: true,
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

      logger.info("Fetched daily sales transactions report");
      res.status(200).json({
        success: true,
        data: transactions,
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
          customer: true,
          location: true,
          paymentType: true,
          transactionType: true,
          salesTransactionItems: {
            include: {
              item: true,
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

      logger.info("Fetched weekly sales transactions report");
      res.status(200).json({
        success: true,
        data: transactions,
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
          customer: true,
          location: true,
          paymentType: true,
          transactionType: true,
          salesTransactionItems: {
            include: {
              item: true,
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

      logger.info("Fetched monthly sales transactions report");
      res.status(200).json({
        success: true,
        data: transactions,
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
}
