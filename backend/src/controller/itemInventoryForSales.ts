import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class ItemInventoryForSales {
  async getInventoryItems(req: Request, res: Response): Promise<void> {
    const { locationID } = req.params;

    try {
      if (!locationID) {
        throw new CustomError("Location ID is required", 400);
      }

      const parsedLocationID = parseInt(locationID, 10);
      if (isNaN(parsedLocationID)) {
        throw new CustomError("Invalid Location ID", 400);
      }

      const inventoryItems = await prisma.inventory.findMany({
        where: {
          locationID: parsedLocationID,
          inventoryType: {
            typeName: "Sellable",
          },
          quantity: {
            gt: 0,
          },
        },
        include: {
          item: true,
          inventoryType: true,
          location: true,
        },
      });

      if (inventoryItems.length === 0) {
        res
          .status(404)
          .json({ message: "No inventory items found matching the criteria." });
        return;
      }

      // Return the inventory items
      res.status(200).json({ inventoryItems });
    } catch (error) {
      logger.error("Error fetching inventory items:", error);
      res.status(500).json({
        message: "An error occurred while fetching inventory items.",
        error:
          error instanceof CustomError
            ? error.message
            : "Internal Server Error",
      });
    }
  }
}
