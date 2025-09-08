import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class CustomerTypeController {
  // Create a new customer type
  async createCustomerType(req: Request, res: Response): Promise<void> {
    const { TypeName, description, createdByID, modifiedByID } = req.body;

    try {
      const newCustomerType = await prisma.customerType.create({
        data: {
          TypeName,
          description,
          createdByID,
          modifiedByID,
        },
      });

      logger.info(
        `Customer Type created: ID ${newCustomerType.customerTypeID}`
      );

      res.status(201).json({
        success: true,
        message: "Customer type created successfully",
        data: newCustomerType,
      });
    } catch (error) {
      logger.error(`Error creating customer type: ${(error as Error).message}`);
      res.status(500).json({
        success: false,
        message: "Error creating customer type",
      });
    }
  }

  // Get all customer types
  async getAllCustomerTypes(req: Request, res: Response): Promise<void> {
    try {
      const customerTypes = await prisma.customerType.findMany({
        include: {
          customers: true,
        },
      });

      logger.info("Fetched all customer types");

      res.status(200).json({
        success: true,
        data: customerTypes,
      });
    } catch (error) {
      logger.error(
        `Error fetching customer types: ${(error as Error).message}`
      );
      res.status(500).json({
        success: false,
        message: "Error fetching customer types",
      });
    }
  }

  // Get customer type by ID
  async getCustomerTypeById(req: Request, res: Response): Promise<void> {
    const { customerTypeID } = req.params;

    try {
      const customerType = await prisma.customerType.findUnique({
        where: { customerTypeID: parseInt(customerTypeID) },
        include: {
          customers: true,
        },
      });

      if (!customerType) {
        res.status(404).json({
          success: false,
          message: "Customer type not found",
        });
        return;
      }

      logger.info(`Fetched customer type with ID ${customerTypeID}`);

      res.status(200).json({
        success: true,
        data: customerType,
      });
    } catch (error) {
      logger.error(`Error fetching customer type: ${(error as Error).message}`);
      res.status(500).json({
        success: false,
        message: "Error fetching customer type",
      });
    }
  }

  // Update customer type
  async updateCustomerType(req: Request, res: Response): Promise<void> {
    const { customerTypeID } = req.params;
    const { TypeName, description, modifiedByID } = req.body;

    try {
      const updatedCustomerType = await prisma.customerType.update({
        where: { customerTypeID: parseInt(customerTypeID) },
        data: {
          TypeName,
          description,
          modifiedByID,
        },
      });

      logger.info(`Customer Type updated: ID ${customerTypeID}`);

      res.status(200).json({
        success: true,
        message: "Customer type updated successfully",
        data: updatedCustomerType,
      });
    } catch (error) {
      logger.error(`Error updating customer type: ${(error as Error).message}`);
      res.status(500).json({
        success: false,
        message: "Error updating customer type",
      });
    }
  }
}
