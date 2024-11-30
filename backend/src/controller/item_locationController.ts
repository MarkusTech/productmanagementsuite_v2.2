import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class LocationController {
  // Create a new location
  async createLocation(req: Request, res: Response): Promise<void> {
    const { locationName, description, createdByID, modifiedByID } = req.body;

    try {
      const newLocation = await prisma.locations.create({
        data: {
          locationName,
          description,
          createdByID,
          modifiedByID,
        },
      });

      logger.info(
        `Location created: ID ${newLocation.locationID}, Name ${locationName}`
      );

      res.status(201).json({
        success: true,
        message: "Location created successfully",
        data: newLocation,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error creating location: ${error.message}`);
        throw new CustomError("Error creating location", 500);
      }
      logger.error("An unexpected error occurred while creating location");
      throw new CustomError("An unexpected error occurred", 500);
    }
  }

  // Get all locations
  async getAllLocations(req: Request, res: Response): Promise<void> {
    try {
      const locations = await prisma.locations.findMany();
      logger.info("Fetched all locations");

      res.status(200).json({
        success: true,
        data: locations,
      });
    } catch (error) {
      logger.error(`Error fetching locations: ${(error as Error).message}`);
      throw new CustomError("Error fetching locations", 500);
    }
  }

  // Get location by ID
  async getLocationById(req: Request, res: Response): Promise<void> {
    const { locationID } = req.params;

    try {
      const location = await prisma.locations.findUnique({
        where: { locationID: parseInt(locationID) },
      });

      if (!location) {
        logger.warn(`Location with ID ${locationID} not found`);
        res.status(404).json({
          success: false,
          message: "Location not found",
        });
      } else {
        logger.info(`Fetched location with ID ${locationID}`);
        res.status(200).json({
          success: true,
          data: location,
        });
      }
    } catch (error) {
      logger.error(`Error fetching location: ${(error as Error).message}`);
      throw new CustomError("Error fetching location", 500);
    }
  }

  // Update location
  async updateLocation(req: Request, res: Response): Promise<void> {
    const { locationID } = req.params;
    const { locationName, description, modifiedByID, status } = req.body;

    try {
      const updatedLocation = await prisma.locations.update({
        where: { locationID: parseInt(locationID) },
        data: {
          locationName,
          description,
          modifiedByID,
          status,
        },
      });

      logger.info(`Location with ID ${locationID} updated`);

      res.status(200).json({
        success: true,
        message: "Location updated successfully",
        data: updatedLocation,
      });
    } catch (error) {
      logger.error(`Error updating location: ${(error as Error).message}`);
      throw new CustomError("Error updating location", 500);
    }
  }

  // Delete location
  async deleteLocation(req: Request, res: Response): Promise<void> {
    const { locationID } = req.params;

    try {
      await prisma.locations.delete({
        where: { locationID: parseInt(locationID) },
      });

      logger.info(`Location with ID ${locationID} deleted`);

      res.status(200).json({
        success: true,
        message: "Location deleted successfully",
      });
    } catch (error) {
      logger.error(`Error deleting location: ${(error as Error).message}`);
      throw new CustomError("Error deleting location", 500);
    }
  }
}
