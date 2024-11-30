import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class InventoryTypeController {
  // Create a new InventoryType
  async createInventoryType(req: Request, res: Response): Promise<void> {
    const { typeName, description, createdByID } = req.body;

    try {
      const newInventoryType = await prisma.inventoryType.create({
        data: {
          typeName,
          description,
          createdByID,
        },
      });

      logger.info(
        `InventoryType created: ID ${newInventoryType.inventoryTypeID}, Name ${typeName}`
      );

      res.status(201).json({
        success: true,
        message: "InventoryType created successfully",
        data: newInventoryType,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error creating inventory type: ${error.message}`);
        throw new CustomError("Error creating inventory type", 500);
      }
      logger.error(
        "An unexpected error occurred while creating inventory type"
      );
      throw new CustomError("An unexpected error occurred", 500);
    }
  }

  // Get all InventoryTypes
  async getAllInventoryTypes(req: Request, res: Response): Promise<void> {
    try {
      const inventoryTypes = await prisma.inventoryType.findMany();
      logger.info("Fetched all inventory types");

      res.status(200).json({
        success: true,
        data: inventoryTypes,
      });
    } catch (error) {
      logger.error(
        `Error fetching inventory types: ${(error as Error).message}`
      );
      throw new CustomError("Error fetching inventory types", 500);
    }
  }

  // Get InventoryType by ID
  async getInventoryTypeById(req: Request, res: Response): Promise<void> {
    const { inventoryTypeID } = req.params;

    try {
      const inventoryType = await prisma.inventoryType.findUnique({
        where: { inventoryTypeID: parseInt(inventoryTypeID) },
      });

      if (!inventoryType) {
        logger.warn(`InventoryType with ID ${inventoryTypeID} not found`);
        res.status(404).json({
          success: false,
          message: "InventoryType not found",
        });
      } else {
        logger.info(`Fetched InventoryType with ID ${inventoryTypeID}`);
        res.status(200).json({
          success: true,
          data: inventoryType,
        });
      }
    } catch (error) {
      logger.error(
        `Error fetching inventory type: ${(error as Error).message}`
      );
      throw new CustomError("Error fetching inventory type", 500);
    }
  }

  // Update InventoryType
  async updateInventoryType(req: Request, res: Response): Promise<void> {
    const { inventoryTypeID } = req.params;
    const { typeName, description, status, modifiedByID } = req.body;

    try {
      const updatedInventoryType = await prisma.inventoryType.update({
        where: { inventoryTypeID: parseInt(inventoryTypeID) },
        data: {
          typeName,
          description,
          status,
          modifiedByID,
        },
      });

      logger.info(`InventoryType with ID ${inventoryTypeID} updated`);

      res.status(200).json({
        success: true,
        message: "InventoryType updated successfully",
        data: updatedInventoryType,
      });
    } catch (error) {
      logger.error(
        `Error updating inventory type: ${(error as Error).message}`
      );
      throw new CustomError("Error updating inventory type", 500);
    }
  }

  // Delete InventoryType
  async deleteInventoryType(req: Request, res: Response): Promise<void> {
    const { inventoryTypeID } = req.params;

    try {
      await prisma.inventoryType.delete({
        where: { inventoryTypeID: parseInt(inventoryTypeID) },
      });

      logger.info(`InventoryType with ID ${inventoryTypeID} deleted`);

      res.status(200).json({
        success: true,
        message: "InventoryType deleted successfully",
      });
    } catch (error) {
      logger.error(
        `Error deleting inventory type: ${(error as Error).message}`
      );
      throw new CustomError("Error deleting inventory type", 500);
    }
  }
}
