import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class PurchaseOrderItemController {
  // Create a new PurchaseOrderItem
  async createPurchaseOrderItem(req: Request, res: Response): Promise<void> {
    const { poID, itemID, uom, unitCost, orderQty } = req.body;

    try {
      const newPurchaseOrderItem = await prisma.purchaseOrderItem.create({
        data: {
          poID,
          itemID,
          uom,
          unitCost,
          orderQty,
        },
      });

      logger.info(
        `Purchase Order Item created: PO ID ${poID}, Item ID ${itemID}`
      );

      res.status(201).json({
        success: true,
        message: "Purchase Order Item created successfully",
        data: newPurchaseOrderItem,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error creating purchase order item: ${error.message}`);
        throw new CustomError("Error creating purchase order item", 500);
      } else {
        logger.error(
          "Unknown error occurred during purchase order item creation"
        );
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Get all PurchaseOrderItems
  async getAllPurchaseOrderItems(req: Request, res: Response): Promise<void> {
    try {
      const purchaseOrderItems = await prisma.purchaseOrderItem.findMany({
        include: {
          purchaseOrder: true,
          item: true,
        },
      });
      logger.info("Fetched all purchase order items");

      res.status(200).json({
        success: true,
        data: purchaseOrderItems,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching purchase order items: ${error.message}`);
        throw new CustomError("Error fetching purchase order items", 500);
      } else {
        logger.error(
          "Unknown error occurred while fetching purchase order items"
        );
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Get PurchaseOrderItem by ID
  async getPurchaseOrderItemById(req: Request, res: Response): Promise<void> {
    const { poItemID } = req.params;

    try {
      const purchaseOrderItem = await prisma.purchaseOrderItem.findUnique({
        where: { poItemID: parseInt(poItemID) },
      });

      if (!purchaseOrderItem) {
        logger.warn(`Purchase Order Item with ID ${poItemID} not found`);
        res.status(404).json({
          success: false,
          message: "Purchase Order Item not found",
        });
      } else {
        logger.info(`Fetched Purchase Order Item with ID ${poItemID}`);
        res.status(200).json({
          success: true,
          data: purchaseOrderItem,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching purchase order item: ${error.message}`);
        throw new CustomError("Error fetching purchase order item", 500);
      } else {
        logger.error(
          "Unknown error occurred while fetching purchase order item"
        );
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Update PurchaseOrderItem
  async updatePurchaseOrderItem(req: Request, res: Response): Promise<void> {
    const { poItemID } = req.params;
    const { poID, itemID, uom, unitCost, orderQty } = req.body;

    try {
      const updatedPurchaseOrderItem = await prisma.purchaseOrderItem.update({
        where: { poItemID: parseInt(poItemID) },
        data: {
          poID,
          itemID,
          uom,
          unitCost,
          orderQty,
        },
      });

      logger.info(`Purchase Order Item with ID ${poItemID} updated`);

      res.status(200).json({
        success: true,
        message: "Purchase Order Item updated successfully",
        data: updatedPurchaseOrderItem,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error updating purchase order item: ${error.message}`);
        throw new CustomError("Error updating purchase order item", 500);
      } else {
        logger.error(
          "Unknown error occurred while updating purchase order item"
        );
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Delete PurchaseOrderItem
  async deletePurchaseOrderItem(req: Request, res: Response): Promise<void> {
    const { poItemID } = req.params;

    try {
      await prisma.purchaseOrderItem.delete({
        where: { poItemID: parseInt(poItemID) },
      });

      logger.info(`Purchase Order Item with ID ${poItemID} deleted`);

      res.status(200).json({
        success: true,
        message: "Purchase Order Item deleted successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error deleting purchase order item: ${error.message}`);
        throw new CustomError("Error deleting purchase order item", 500);
      } else {
        logger.error(
          "Unknown error occurred while deleting purchase order item"
        );
        throw new CustomError("Unknown error", 500);
      }
    }
  }
}
