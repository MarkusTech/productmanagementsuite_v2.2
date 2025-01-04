import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class InventoryAdjustmentController {
  // Create a new InventoryAdjustment
  async createInventoryAdjustment(req: Request, res: Response): Promise<void> {
    const {
      inventoryID,
      adjustmentTypeID,
      adjustmentReasonID,
      quantityAdjusted,
      status,
      createdByID,
    } = req.body;

    try {
      // Check if inventoryID exists
      const inventory = await prisma.inventory.findUnique({
        where: { inventoryID },
      });
      if (!inventory) {
        res
          .status(400)
          .json({ success: false, message: "Inventory ID does not exist." });
      }

      // Check if adjustmentTypeID exists
      const adjustmentType = await prisma.adjustmentType.findUnique({
        where: { adjustmentTypeID },
      });
      if (!adjustmentType) {
        res.status(400).json({
          success: false,
          message: "Adjustment Type ID does not exist.",
        });
      }

      // Check if adjustmentReasonID exists
      const adjustmentReason = await prisma.adjustmentReason.findUnique({
        where: { adjustmentReasonID },
      });
      if (!adjustmentReason) {
        res.status(400).json({
          success: false,
          message: "Adjustment Reason ID does not exist.",
        });
      }

      // Create the new inventory adjustment
      const newInventoryAdjustment = await prisma.inventoryAdjustment.create({
        data: {
          inventoryID,
          adjustmentTypeID,
          adjustmentReasonID,
          quantityAdjusted,
          status,
          createdByID,
        },
      });

      logger.info(
        `InventoryAdjustment created: ID ${newInventoryAdjustment.adjustmentID}`
      );

      res.status(201).json({
        success: true,
        message: "InventoryAdjustment created successfully",
        data: newInventoryAdjustment,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error creating inventory adjustment: ${error.message}`);
        res.status(500).json({
          success: false,
          message: "Error creating inventory adjustment",
        });
      } else {
        logger.error(
          "An unexpected error occurred while creating inventory adjustment"
        );
        res
          .status(500)
          .json({ success: false, message: "An unexpected error occurred" });
      }
    }
  }

  // Get all InventoryAdjustments
  async getAllInventoryAdjustments(req: Request, res: Response): Promise<void> {
    try {
      const inventoryAdjustments = await prisma.inventoryAdjustment.findMany({
        include: {
          inventory: {
            include: {
              item: {
                select: {
                  itemID: true,
                  itemName: true,
                  image_url: true,
                },
              },
            },
          },
          adjustmentType: true,
          adjustmentReason: true,
        },
      });

      logger.info("Fetched all inventory adjustments");

      res.status(200).json({
        success: true,
        data: inventoryAdjustments,
      });
    } catch (error) {
      logger.error(
        `Error fetching inventory adjustments: ${(error as Error).message}`
      );
      throw new CustomError("Error fetching inventory adjustments", 500);
    }
  }

  // Get InventoryAdjustment by ID
  async getInventoryAdjustmentById(req: Request, res: Response): Promise<void> {
    const { adjustmentID } = req.params;

    try {
      const inventoryAdjustment = await prisma.inventoryAdjustment.findUnique({
        where: { adjustmentID: parseInt(adjustmentID) },
      });

      if (!inventoryAdjustment) {
        logger.warn(`InventoryAdjustment with ID ${adjustmentID} not found`);
        res.status(404).json({
          success: false,
          message: "InventoryAdjustment not found",
        });
      } else {
        logger.info(`Fetched InventoryAdjustment with ID ${adjustmentID}`);
        res.status(200).json({
          success: true,
          data: inventoryAdjustment,
        });
      }
    } catch (error) {
      logger.error(
        `Error fetching inventory adjustment: ${(error as Error).message}`
      );
      throw new CustomError("Error fetching inventory adjustment", 500);
    }
  }

  // Update InventoryAdjustment
  async updateInventoryAdjustment(req: Request, res: Response): Promise<void> {
    const { adjustmentID } = req.params;
    const {
      inventoryID,
      adjustmentTypeID,
      adjustmentReasonID,
      quantityAdjusted,
      status,
      modifiedByID,
    } = req.body;

    try {
      const updatedInventoryAdjustment =
        await prisma.inventoryAdjustment.update({
          where: { adjustmentID: parseInt(adjustmentID) },
          data: {
            inventoryID,
            adjustmentTypeID,
            adjustmentReasonID,
            quantityAdjusted,
            status,
            modifiedByID,
          },
        });

      logger.info(`InventoryAdjustment with ID ${adjustmentID} updated`);

      res.status(200).json({
        success: true,
        message: "InventoryAdjustment updated successfully",
        data: updatedInventoryAdjustment,
      });
    } catch (error) {
      logger.error(
        `Error updating inventory adjustment: ${(error as Error).message}`
      );
      throw new CustomError("Error updating inventory adjustment", 500);
    }
  }

  // Approve
  async inventoryApproved(req: Request, res: Response): Promise<void> {
    const { inventoryID, adjustmentID } = req.params;

    try {
      // Fetch the inventory adjustment record
      const adjustment = await prisma.inventoryAdjustment.findUnique({
        where: { adjustmentID: Number(adjustmentID) },
      });

      if (!adjustment) {
        throw new CustomError("Inventory adjustment not found", 404);
      }

      // Ensure the adjustment belongs to the specified inventory
      if (adjustment.inventoryID !== Number(inventoryID)) {
        throw new CustomError(
          "Inventory adjustment does not match inventory",
          400
        );
      }

      // Check if the adjustment is already completed
      if (adjustment.status === "Completed") {
        throw new CustomError("Inventory adjustment is already completed", 400);
      }

      // Begin transaction
      const updatedData = await prisma.$transaction(async (tx) => {
        // Update inventory quantity based on the adjustment
        const inventory = await tx.inventory.findUnique({
          where: { inventoryID: Number(inventoryID) },
        });

        if (!inventory) {
          throw new CustomError("Inventory record not found", 404);
        }

        // Adjust the quantity
        const newQuantity = inventory.quantity + adjustment.quantityAdjusted;

        // Update the inventory table
        const updatedInventory = await tx.inventory.update({
          where: { inventoryID: Number(inventoryID) },
          data: { quantity: newQuantity },
        });

        // Update the adjustment's status to "Completed"
        const updatedAdjustment = await tx.inventoryAdjustment.update({
          where: { adjustmentID: Number(adjustmentID) },
          data: { status: "Completed" },
        });

        return { updatedInventory, updatedAdjustment };
      });

      res.status(200).json({
        message: "Inventory and adjustment updated successfully",
        data: updatedData,
      });
    } catch (error) {
      logger.error(
        `Error updating inventory adjustment: ${(error as Error).message}`
      );
      res.status(500).json({
        error: "Error updating inventory adjustment",
        message: (error as Error).message,
      });
    }
  }

  // Decline
  async inventoryDeclined(req: Request, res: Response): Promise<void> {
    const { adjustmentID } = req.params;

    try {
      // Fetch the inventory adjustment record
      const adjustment = await prisma.inventoryAdjustment.findUnique({
        where: { adjustmentID: Number(adjustmentID) },
      });

      // Check if the adjustment exists
      if (!adjustment) {
        throw new CustomError("Inventory adjustment not found", 404);
      }

      // Check if the adjustment is already declined
      if (adjustment.status === "Declined") {
        throw new CustomError("Inventory adjustment is already declined", 400);
      }

      // Update the adjustment's status to "Declined"
      const updatedAdjustment = await prisma.inventoryAdjustment.update({
        where: { adjustmentID: Number(adjustmentID) },
        data: { status: "Declined" },
      });

      res.status(200).json({
        message: "Inventory adjustment has been declined",
        data: updatedAdjustment,
      });
    } catch (error) {
      logger.error(
        `Error declining inventory adjustment: ${(error as Error).message}`
      );
      res.status(500).json({
        error: "Error declining inventory adjustment",
        message: (error as Error).message,
      });
    }
  }

  // async inventoryDeclined(req: Request, res: Response): Promise<void> {
  //   const { adjustmentID } = req.params;

  //   try {
  //     // Fetch the inventory adjustment record
  //     const adjustment = await prisma.inventoryAdjustment.findUnique({
  //       where: { adjustmentID: Number(adjustmentID) },
  //     });

  //     // Check if the adjustment exists
  //     if (!adjustment) {
  //       throw new CustomError("Inventory adjustment not found", 404);
  //     }

  //     // Check if the adjustment is already declined
  //     if (adjustment.status === "Declined") {
  //       throw new CustomError("Inventory adjustment is already declined", 400);
  //     }

  //     // Subtract the quantity if needed and update the inventory and adjustment
  //     const updatedData = await prisma.$transaction(async (tx) => {
  //       const inventory = await tx.inventory.findUnique({
  //         where: { inventoryID: adjustment.inventoryID },
  //       });

  //       if (!inventory) {
  //         throw new CustomError("Inventory record not found", 404);
  //       }

  //       const newQuantity = inventory.quantity - adjustment.quantityAdjusted;

  //       const updatedInventory = await tx.inventory.update({
  //         where: { inventoryID: adjustment.inventoryID },
  //         data: { quantity: newQuantity },
  //       });

  //       const updatedAdjustment = await tx.inventoryAdjustment.update({
  //         where: { adjustmentID: Number(adjustmentID) },
  //         data: { status: "Declined" },
  //       });

  //       return { updatedInventory, updatedAdjustment };
  //     });

  //     res.status(200).json({
  //       message: "Inventory updated and adjustment has been declined",
  //       data: updatedData,
  //     });
  //   } catch (error) {
  //     logger.error(
  //       `Error declining inventory adjustment: ${(error as Error).message}`
  //     );
  //     res.status(500).json({
  //       error: "Error declining inventory adjustment",
  //       message: (error as Error).message,
  //     });
  //   }
  // }

  // Delete InventoryAdjustment
  async deleteInventoryAdjustment(req: Request, res: Response): Promise<void> {
    const { adjustmentID } = req.params;

    try {
      await prisma.inventoryAdjustment.delete({
        where: { adjustmentID: parseInt(adjustmentID) },
      });

      logger.info(`InventoryAdjustment with ID ${adjustmentID} deleted`);

      res.status(200).json({
        success: true,
        message: "InventoryAdjustment deleted successfully",
      });
    } catch (error) {
      logger.error(
        `Error deleting inventory adjustment: ${(error as Error).message}`
      );
      throw new CustomError("Error deleting inventory adjustment", 500);
    }
  }
}
