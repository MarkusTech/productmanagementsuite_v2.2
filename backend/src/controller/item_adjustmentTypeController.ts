import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class AdjustmentTypeController {
  // Create a new AdjustmentType
  async createAdjustmentType(req: Request, res: Response): Promise<void> {
    const { typeName, description, createdByID, modifiedByID } = req.body;

    try {
      const newAdjustmentType = await prisma.adjustmentType.create({
        data: {
          typeName,
          description,
          createdByID,
          modifiedByID,
        },
      });

      logger.info(
        `AdjustmentType created: ID ${newAdjustmentType.adjustmentTypeID}`
      );

      res.status(201).json({
        success: true,
        message: "AdjustmentType created successfully",
        data: newAdjustmentType,
      });
    } catch (error) {
      logger.error(
        `Error creating adjustment type: ${(error as Error).message}`
      );
      throw new CustomError("Error creating adjustment type", 500);
    }
  }

  // Get all AdjustmentTypes
  async getAllAdjustmentTypes(req: Request, res: Response): Promise<void> {
    try {
      const adjustmentTypes = await prisma.adjustmentType.findMany();
      logger.info("Fetched all adjustment types");

      res.status(200).json({
        success: true,
        data: adjustmentTypes,
      });
    } catch (error) {
      logger.error(
        `Error fetching adjustment types: ${(error as Error).message}`
      );
      throw new CustomError("Error fetching adjustment types", 500);
    }
  }

  // Get AdjustmentType by ID
  async getAdjustmentTypeById(req: Request, res: Response): Promise<void> {
    const { adjustmentTypeID } = req.params;

    try {
      const adjustmentType = await prisma.adjustmentType.findUnique({
        where: { adjustmentTypeID: parseInt(adjustmentTypeID) },
      });

      if (!adjustmentType) {
        logger.warn(`AdjustmentType with ID ${adjustmentTypeID} not found`);
        throw new CustomError("AdjustmentType not found", 404);
      } else {
        logger.info(`Fetched adjustment type with ID ${adjustmentTypeID}`);
        res.status(200).json({
          success: true,
          data: adjustmentType,
        });
      }
    } catch (error) {
      logger.error(
        `Error fetching adjustment type: ${(error as Error).message}`
      );
      throw new CustomError("Error fetching adjustment type", 500);
    }
  }

  // Update AdjustmentType
  async updateAdjustmentType(req: Request, res: Response): Promise<void> {
    const { adjustmentTypeID } = req.params;
    const { typeName, modifiedByID } = req.body;

    try {
      const updatedAdjustmentType = await prisma.adjustmentType.update({
        where: { adjustmentTypeID: parseInt(adjustmentTypeID) },
        data: {
          typeName,
          modifiedByID,
        },
      });

      logger.info(`AdjustmentType with ID ${adjustmentTypeID} updated`);

      res.status(200).json({
        success: true,
        message: "AdjustmentType updated successfully",
        data: updatedAdjustmentType,
      });
    } catch (error) {
      logger.error(
        `Error updating adjustment type: ${(error as Error).message}`
      );
      throw new CustomError("Error updating adjustment type", 500);
    }
  }

  // Delete AdjustmentType
  async deleteAdjustmentType(req: Request, res: Response): Promise<void> {
    const { adjustmentTypeID } = req.params;

    try {
      await prisma.adjustmentType.delete({
        where: { adjustmentTypeID: parseInt(adjustmentTypeID) },
      });

      logger.info(`AdjustmentType with ID ${adjustmentTypeID} deleted`);

      res.status(200).json({
        success: true,
        message: "AdjustmentType deleted successfully",
      });
    } catch (error) {
      logger.error(
        `Error deleting adjustment type: ${(error as Error).message}`
      );
      throw new CustomError("Error deleting adjustment type", 500);
    }
  }
}
