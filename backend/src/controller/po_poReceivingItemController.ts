import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class PoReceivingItemController {
  // Create a new poReceivingItem
  async createPoReceivingItem(req: Request, res: Response): Promise<void> {
    const { itemID, uom, receivedQty, unitCost } = req.body;

    try {
      const newPoReceivingItem = await prisma.poReceivingItem.create({
        data: {
          itemID,
          uom,
          receivedQty,
          unitCost,
        },
      });

      logger.info(`PO Receiving Item created: Item ID ${itemID}, UOM ${uom}`);

      res.status(201).json({
        success: true,
        message: "PO Receiving Item created successfully",
        data: newPoReceivingItem,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error creating PO receiving item: ${error.message}`);
        throw new CustomError("Error creating PO receiving item", 500);
      } else {
        logger.error(
          "Unknown error occurred during PO receiving item creation"
        );
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Get all poReceivingItems
  async getAllPoReceivingItems(req: Request, res: Response): Promise<void> {
    try {
      const poReceivingItems = await prisma.poReceivingItem.findMany({
        include: {
          item: true,
        },
      });

      logger.info("Fetched all PO receiving items");

      res.status(200).json({
        success: true,
        data: poReceivingItems,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching PO receiving items: ${error.message}`);
        throw new CustomError("Error fetching PO receiving items", 500);
      } else {
        logger.error(
          "Unknown error occurred while fetching PO receiving items"
        );
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Get poReceivingItem by ID
  async getPoReceivingItemById(req: Request, res: Response): Promise<void> {
    const { poReceivingItemID } = req.params;

    try {
      const poReceivingItem = await prisma.poReceivingItem.findUnique({
        where: { poReceivingItemID: parseInt(poReceivingItemID) },
      });

      if (!poReceivingItem) {
        logger.warn(`PO Receiving Item with ID ${poReceivingItemID} not found`);
        res.status(404).json({
          success: false,
          message: "PO Receiving Item not found",
        });
      } else {
        logger.info(`Fetched PO Receiving Item with ID ${poReceivingItemID}`);
        res.status(200).json({
          success: true,
          data: poReceivingItem,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching PO receiving item: ${error.message}`);
        throw new CustomError("Error fetching PO receiving item", 500);
      } else {
        logger.error("Unknown error occurred while fetching PO receiving item");
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Update poReceivingItem
  async updatePoReceivingItem(req: Request, res: Response): Promise<void> {
    const { poReceivingItemID } = req.params;
    const { itemID, uom, receivedQty, unitCost } = req.body;

    try {
      const updatedPoReceivingItem = await prisma.poReceivingItem.update({
        where: { poReceivingItemID: parseInt(poReceivingItemID) },
        data: {
          itemID,
          uom,
          receivedQty,
          unitCost,
        },
      });

      logger.info(`PO Receiving Item with ID ${poReceivingItemID} updated`);

      res.status(200).json({
        success: true,
        message: "PO Receiving Item updated successfully",
        data: updatedPoReceivingItem,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error updating PO receiving item: ${error.message}`);
        throw new CustomError("Error updating PO receiving item", 500);
      } else {
        logger.error("Unknown error occurred while updating PO receiving item");
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Delete poReceivingItem
  async deletePoReceivingItem(req: Request, res: Response): Promise<void> {
    const { poReceivingItemID } = req.params;

    try {
      await prisma.poReceivingItem.delete({
        where: { poReceivingItemID: parseInt(poReceivingItemID) },
      });

      logger.info(`PO Receiving Item with ID ${poReceivingItemID} deleted`);

      res.status(200).json({
        success: true,
        message: "PO Receiving Item deleted successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error deleting PO receiving item: ${error.message}`);
        throw new CustomError("Error deleting PO receiving item", 500);
      } else {
        logger.error("Unknown error occurred while deleting PO receiving item");
        throw new CustomError("Unknown error", 500);
      }
    }
  }
}
