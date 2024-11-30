import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class PoSupplierController {
  // Create a new Supplier
  async createSupplier(req: Request, res: Response): Promise<void> {
    const {
      supplierName,
      contactDetails,
      address,
      email,
      createdByID,
      modifiedByID,
    } = req.body;

    try {
      const newSupplier = await prisma.poSupplier.create({
        data: {
          supplierName,
          contactDetails,
          address,
          email,
          createdByID,
          modifiedByID,
        },
      });

      logger.info(`Supplier created: ${supplierName}`);

      res.status(201).json({
        success: true,
        message: "Supplier created successfully",
        data: newSupplier,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error creating supplier: ${error.message}`);
        throw new CustomError("Error creating supplier", 500);
      } else {
        logger.error("Unknown error occurred during supplier creation");
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Get all Suppliers
  async getAllSuppliers(req: Request, res: Response): Promise<void> {
    try {
      const suppliers = await prisma.poSupplier.findMany();
      logger.info("Fetched all suppliers");
      res.status(200).json({
        success: true,
        data: suppliers,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching suppliers: ${error.message}`);
        throw new CustomError("Error fetching suppliers", 500);
      } else {
        logger.error("Unknown error occurred while fetching suppliers");
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Get Supplier by ID
  async getSupplierById(req: Request, res: Response): Promise<void> {
    const { supplierID } = req.params;

    try {
      const supplier = await prisma.poSupplier.findUnique({
        where: { supplierID: parseInt(supplierID) },
      });

      if (!supplier) {
        logger.warn(`Supplier with ID ${supplierID} not found`);
        res.status(404).json({
          success: false,
          message: "Supplier not found",
        });
      } else {
        logger.info(`Fetched supplier with ID ${supplierID}`);
        res.status(200).json({
          success: true,
          data: supplier,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching supplier: ${error.message}`);
        throw new CustomError("Error fetching supplier", 500);
      } else {
        logger.error("Unknown error occurred while fetching supplier");
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Update Supplier
  async updateSupplier(req: Request, res: Response): Promise<void> {
    const { supplierID } = req.params;
    const { supplierName, contactDetails, address, email, modifiedByID } =
      req.body;

    try {
      const updatedSupplier = await prisma.poSupplier.update({
        where: { supplierID: parseInt(supplierID) },
        data: {
          supplierName,
          contactDetails,
          address,
          email,
          modifiedByID,
        },
      });

      logger.info(`Supplier with ID ${supplierID} updated`);

      res.status(200).json({
        success: true,
        message: "Supplier updated successfully",
        data: updatedSupplier,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error updating supplier: ${error.message}`);
        throw new CustomError("Error updating supplier", 500);
      } else {
        logger.error("Unknown error occurred while updating supplier");
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Delete Supplier
  async deleteSupplier(req: Request, res: Response): Promise<void> {
    const { supplierID } = req.params;

    try {
      await prisma.poSupplier.delete({
        where: { supplierID: parseInt(supplierID) },
      });

      logger.info(`Supplier with ID ${supplierID} deleted`);

      res.status(200).json({
        success: true,
        message: "Supplier deleted successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error deleting supplier: ${error.message}`);
        throw new CustomError("Error deleting supplier", 500);
      } else {
        logger.error("Unknown error occurred while deleting supplier");
        throw new CustomError("Unknown error", 500);
      }
    }
  }
}
