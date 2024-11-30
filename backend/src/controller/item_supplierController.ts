import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class SupplierController {
  // Create a new supplier
  async createSupplier(req: Request, res: Response): Promise<void> {
    const { supplierName, description, status } = req.body;

    try {
      const newSupplier = await prisma.suppliers.create({
        data: {
          supplierName,
          description,
          status,
        },
      });

      logger.info(
        `Supplier created: ID ${newSupplier.supplierID}, Name ${supplierName}`
      );

      res.status(201).json({
        success: true,
        message: "Supplier created successfully",
        data: newSupplier,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error creating supplier: ${error.message}`);
        throw new CustomError("Error creating supplier", 500);
      }
      logger.error("An unexpected error occurred while creating supplier");
      throw new CustomError("An unexpected error occurred", 500);
    }
  }

  // Get all suppliers
  async getAllSuppliers(req: Request, res: Response): Promise<void> {
    try {
      const suppliers = await prisma.suppliers.findMany();
      logger.info("Fetched all suppliers");

      res.status(200).json({
        success: true,
        data: suppliers,
      });
    } catch (error) {
      logger.error(`Error fetching suppliers: ${(error as Error).message}`);
      throw new CustomError("Error fetching suppliers", 500);
    }
  }

  // Get supplier by ID
  async getSupplierById(req: Request, res: Response): Promise<void> {
    const { supplierID } = req.params;

    try {
      const supplier = await prisma.suppliers.findUnique({
        where: { supplierID: parseInt(supplierID) },
      });

      if (!supplier) {
        logger.warn(`Supplier with ID ${supplierID} not found`);
        throw new CustomError("Supplier not found", 404);
      } else {
        logger.info(`Fetched supplier with ID ${supplierID}`);
        res.status(200).json({
          success: true,
          data: supplier,
        });
      }
    } catch (error) {
      logger.error(`Error fetching supplier: ${(error as Error).message}`);
      throw new CustomError("Error fetching supplier", 500);
    }
  }

  // Update supplier
  async updateSupplier(req: Request, res: Response): Promise<void> {
    const { supplierID } = req.params;
    const { supplierName, description, status } = req.body;

    try {
      const updatedSupplier = await prisma.suppliers.update({
        where: { supplierID: parseInt(supplierID) },
        data: {
          supplierName,
          description,
          status,
        },
      });

      logger.info(`Supplier with ID ${supplierID} updated`);

      res.status(200).json({
        success: true,
        message: "Supplier updated successfully",
        data: updatedSupplier,
      });
    } catch (error) {
      logger.error(`Error updating supplier: ${(error as Error).message}`);
      throw new CustomError("Error updating supplier", 500);
    }
  }

  // Delete supplier
  async deleteSupplier(req: Request, res: Response): Promise<void> {
    const { supplierID } = req.params;

    try {
      await prisma.suppliers.delete({
        where: { supplierID: parseInt(supplierID) },
      });

      logger.info(`Supplier with ID ${supplierID} deleted`);

      res.status(200).json({
        success: true,
        message: "Supplier deleted successfully",
      });
    } catch (error) {
      logger.error(`Error deleting supplier: ${(error as Error).message}`);
      throw new CustomError("Error deleting supplier", 500);
    }
  }
}
