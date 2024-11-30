import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class CustomerController {
  // Create a new customer
  async createCustomer(req: Request, res: Response): Promise<void> {
    const {
      firstName,
      middleName,
      lastName,
      contactNo,
      address,
      email,
      customerTypeID,
      createdByID,
      modifiedByID,
    } = req.body;

    try {
      const newCustomer = await prisma.customers.create({
        data: {
          firstName,
          middleName,
          lastName,
          contactNo,
          address,
          email,
          customerTypeID, // Nullable field
          createdByID,
          modifiedByID,
        },
        include: {
          customerType: true, // Include related customerType information
        },
      });

      logger.info(`Customer created: ID ${newCustomer.customerID}`);

      res.status(201).json({
        success: true,
        message: "Customer created successfully",
        data: newCustomer,
      });
    } catch (error) {
      logger.error(`Error creating customer: ${(error as Error).message}`);
      res.status(500).json({
        success: false,
        message: "Error creating customer",
      });
    }
  }

  // Get all customers
  async getAllCustomers(req: Request, res: Response): Promise<void> {
    try {
      const customers = await prisma.customers.findMany({
        include: {
          customerType: true, // Include related customerType information
        },
      });

      logger.info("Fetched all customers");

      res.status(200).json({
        success: true,
        data: customers,
      });
    } catch (error) {
      logger.error(`Error fetching customers: ${(error as Error).message}`);
      res.status(500).json({
        success: false,
        message: "Error fetching customers",
      });
    }
  }

  // Get a single customer by ID
  async getCustomerById(req: Request, res: Response): Promise<void> {
    const { customerID } = req.params;

    try {
      const customer = await prisma.customers.findUnique({
        where: { customerID: parseInt(customerID) },
        include: {
          customerType: true, // Include related customerType information
        },
      });

      if (!customer) {
        res.status(404).json({
          success: false,
          message: "Customer not found",
        });
        return;
      }

      logger.info(`Fetched customer with ID ${customerID}`);

      res.status(200).json({
        success: true,
        data: customer,
      });
    } catch (error) {
      logger.error(`Error fetching customer: ${(error as Error).message}`);
      res.status(500).json({
        success: false,
        message: "Error fetching customer",
      });
    }
  }

  // Update a customer
  async updateCustomer(req: Request, res: Response): Promise<void> {
    const { customerID } = req.params;
    const {
      firstName,
      middleName,
      lastName,
      contactNo,
      address,
      email,
      customerTypeID,
      modifiedByID,
    } = req.body;

    try {
      const updatedCustomer = await prisma.customers.update({
        where: { customerID: parseInt(customerID) },
        data: {
          firstName,
          middleName,
          lastName,
          contactNo,
          address,
          email,
          customerTypeID, // Nullable field
          modifiedByID,
        },
        include: {
          customerType: true, // Include related customerType information
        },
      });

      logger.info(`Customer updated: ID ${customerID}`);

      res.status(200).json({
        success: true,
        message: "Customer updated successfully",
        data: updatedCustomer,
      });
    } catch (error) {
      logger.error(`Error updating customer: ${(error as Error).message}`);
      res.status(500).json({
        success: false,
        message: "Error updating customer",
      });
    }
  }
}
