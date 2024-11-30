import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class PoReceivingController {
  // Create a new poReceiving
  async createPoReceiving(req: Request, res: Response): Promise<void> {
    const {
      poID,
      receivedDate,
      referenceNumber,
      totalCost,
      totalQty,
      status,
      receivedByID,
    } = req.body;

    try {
      const newPoReceiving = await prisma.poReceiving.create({
        data: {
          poID,
          receivedDate,
          referenceNumber,
          totalCost,
          totalQty,
          status,
          receivedByID,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      logger.info(
        `PO Receiving created: ID ${newPoReceiving.poReceivingID}, PO ID ${poID}`
      );

      res.status(201).json({
        success: true,
        message: "PO Receiving created successfully",
        data: newPoReceiving,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error creating PO receiving: ${error.message}`);
        throw new CustomError("Error creating PO receiving", 500);
      } else {
        logger.error("Unknown error occurred during PO receiving creation");
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Get all poReceiving records
  async getAllPoReceiving(req: Request, res: Response): Promise<void> {
    try {
      const poReceivingRecords = await prisma.poReceiving.findMany({
        include: {
          purchaseOrder: true,
          receivedBy: true,
        },
      });
      logger.info("Fetched all PO receiving records");

      res.status(200).json({
        success: true,
        data: poReceivingRecords,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching PO receiving records: ${error.message}`);
        throw new CustomError("Error fetching PO receiving records", 500);
      } else {
        logger.error(
          "Unknown error occurred while fetching PO receiving records"
        );
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Get poReceiving by ID
  async getPoReceivingById(req: Request, res: Response): Promise<void> {
    const { poReceivingID } = req.params;

    try {
      const poReceiving = await prisma.poReceiving.findUnique({
        where: { poReceivingID: parseInt(poReceivingID) },
      });

      if (!poReceiving) {
        logger.warn(`PO Receiving with ID ${poReceivingID} not found`);
        res.status(404).json({
          success: false,
          message: "PO Receiving not found",
        });
      } else {
        logger.info(`Fetched PO Receiving with ID ${poReceivingID}`);
        res.status(200).json({
          success: true,
          data: poReceiving,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching PO receiving: ${error.message}`);
        throw new CustomError("Error fetching PO receiving", 500);
      } else {
        logger.error("Unknown error occurred while fetching PO receiving");
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Update poReceiving
  async updatePoReceiving(req: Request, res: Response): Promise<void> {
    const { poReceivingID } = req.params;
    const {
      poID,
      receivedDate,
      referenceNumber,
      totalCost,
      totalQty,
      status,
      receivedByID,
    } = req.body;

    try {
      const updatedPoReceiving = await prisma.poReceiving.update({
        where: { poReceivingID: parseInt(poReceivingID) },
        data: {
          poID,
          receivedDate,
          referenceNumber,
          totalCost,
          totalQty,
          status,
          receivedByID,
          updatedAt: new Date(),
        },
      });

      logger.info(`PO Receiving with ID ${poReceivingID} updated`);

      res.status(200).json({
        success: true,
        message: "PO Receiving updated successfully",
        data: updatedPoReceiving,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error updating PO receiving: ${error.message}`);
        throw new CustomError("Error updating PO receiving", 500);
      } else {
        logger.error("Unknown error occurred while updating PO receiving");
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Delete poReceiving
  async deletePoReceiving(req: Request, res: Response): Promise<void> {
    const { poReceivingID } = req.params;

    try {
      await prisma.poReceiving.delete({
        where: { poReceivingID: parseInt(poReceivingID) },
      });

      logger.info(`PO Receiving with ID ${poReceivingID} deleted`);

      res.status(200).json({
        success: true,
        message: "PO Receiving deleted successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error deleting PO receiving: ${error.message}`);
        throw new CustomError("Error deleting PO receiving", 500);
      } else {
        logger.error("Unknown error occurred while deleting PO receiving");
        throw new CustomError("Unknown error", 500);
      }
    }
  }
}
