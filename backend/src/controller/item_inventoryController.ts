import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class InventoryController {
  // Create a new inventory record
  async createInventory(req: Request, res: Response): Promise<void> {
    const { locationID, itemID, quantity, inventoryTypeID, reOrderThreshold } =
      req.body;

    try {
      const newInventory = await prisma.inventory.create({
        data: {
          locationID,
          itemID,
          quantity,
          inventoryTypeID,
          reOrderThreshold,
        },
      });

      logger.info(
        `Inventory created: ID ${newInventory.inventoryID}, Item ID ${itemID}`
      );

      res.status(201).json({
        success: true,
        message: "Inventory created successfully",
        data: newInventory,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error creating inventory: ${error.message}`);
        throw new CustomError("Error creating inventory", 500);
      }
      logger.error("An unexpected error occurred while creating inventory");
      throw new CustomError("An unexpected error occurred", 500);
    }
  }

  // Get all inventory records
  async getAllInventory(req: Request, res: Response): Promise<void> {
    try {
      // Get filters from the query params
      const { inventoryID, inventoryType, location, item, quantity } =
        req.query;

      // Build the Prisma query filter
      const filterConditions: any = {};

      if (inventoryID) filterConditions.inventoryID = inventoryID;
      if (inventoryType)
        filterConditions.inventoryType = {
          typeName: { contains: inventoryType },
        };
      if (location)
        filterConditions.location = { locationName: { contains: location } };
      if (item) filterConditions.item = { itemName: { contains: item } };
      if (quantity) filterConditions.quantity = quantity;

      // Fetch inventories from Prisma with applied filters
      const inventory = await prisma.inventory.findMany({
        where: filterConditions,
        include: {
          item: {
            select: {
              itemID: true,
              itemName: true,
              image_url: true,
            },
          },
          location: {
            select: {
              locationID: true,
              locationName: true,
            },
          },
          inventoryType: {
            select: {
              inventoryTypeID: true,
              typeName: true,
            },
          },
        },
      });

      logger.info("Fetched filtered inventory records");

      res.status(200).json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      logger.error(`Error fetching inventory: ${(error as Error).message}`);
      throw new CustomError("Error fetching inventory", 500);
    }
  }

  // Get inventory by ID
  async getInventoryById(req: Request, res: Response): Promise<void> {
    const { inventoryID } = req.params;

    try {
      const inventory = await prisma.inventory.findUnique({
        where: { inventoryID: parseInt(inventoryID) },
      });

      if (!inventory) {
        logger.warn(`Inventory with ID ${inventoryID} not found`);
        res.status(404).json({
          success: false,
          message: "Inventory not found",
        });
      } else {
        logger.info(`Fetched inventory with ID ${inventoryID}`);
        res.status(200).json({
          success: true,
          data: inventory,
        });
      }
    } catch (error) {
      logger.error(`Error fetching inventory: ${(error as Error).message}`);
      throw new CustomError("Error fetching inventory", 500);
    }
  }

  // Update inventory
  async updateInventory(req: Request, res: Response): Promise<void> {
    const { inventoryID } = req.params;
    const { locationID, itemID, quantity, inventoryTypeID, reOrderThreshold } =
      req.body;

    try {
      const updatedInventory = await prisma.inventory.update({
        where: { inventoryID: parseInt(inventoryID) },
        data: {
          locationID,
          itemID,
          quantity,
          inventoryTypeID,
          reOrderThreshold,
        },
      });

      logger.info(`Inventory with ID ${inventoryID} updated`);

      res.status(200).json({
        success: true,
        message: "Inventory updated successfully",
        data: updatedInventory,
      });
    } catch (error) {
      logger.error(`Error updating inventory: ${(error as Error).message}`);
      throw new CustomError("Error updating inventory", 500);
    }
  }

  // Delete inventory
  async deleteInventory(req: Request, res: Response): Promise<void> {
    const { inventoryID } = req.params;

    try {
      await prisma.inventory.delete({
        where: { inventoryID: parseInt(inventoryID) },
      });

      logger.info(`Inventory with ID ${inventoryID} deleted`);

      res.status(200).json({
        success: true,
        message: "Inventory deleted successfully",
      });
    } catch (error) {
      logger.error(`Error deleting inventory: ${(error as Error).message}`);
      throw new CustomError("Error deleting inventory", 500);
    }
  }
}
