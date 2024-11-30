// src/controllers/purchaseOrderController.ts
import { Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";
import { PrismaClient, PurchaseOrderItem } from "@prisma/client";

const prisma = new PrismaClient();

export class PurchaseOrderController {
  // Create a new PurchaseOrder
  async createPurchaseOrder(req: Request, res: Response): Promise<void> {
    const {
      supplierID,
      orderDate,
      expectedDeliverDate,
      status,
      locationID,
      createdByID,
      modifiedByID,
      referenceNo,
      remarks,
    } = req.body;

    try {
      // Get the latest poNumber
      const lastPurchaseOrder = await prisma.purchaseOrder.findFirst({
        orderBy: { poNumber: "desc" },
        select: { poNumber: true },
      });

      // Determine the new poNumber
      const newPoNumber = lastPurchaseOrder
        ? lastPurchaseOrder.poNumber + 1
        : 10000;

      // Create the new purchase order
      const newPurchaseOrder = await prisma.purchaseOrder.create({
        data: {
          poNumber: newPoNumber,
          supplierID,
          orderDate,
          expectedDeliverDate,
          status,
          locationID,
          createdByID,
          modifiedByID,
          referenceNo,
          remarks,
        },
      });

      logger.info(
        `Purchase Order created: PO Number ${newPoNumber}, Supplier ID ${supplierID}`
      );

      res.status(201).json({
        success: true,
        message: "Purchase Order created successfully",
        data: newPurchaseOrder,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error creating purchase order: ${error.message}`);
        res.status(500).json({
          success: false,
          message: "Error creating purchase order",
          error: error.message,
        });
      } else {
        logger.error("Unknown error occurred during purchase order creation");
        res.status(500).json({
          success: false,
          message: "Unknown error",
        });
      }
    }
  }

  // Purchase Order and Items
  async createPurchaseOrderAndItems(
    req: Request,
    res: Response
  ): Promise<void> {
    const {
      supplierID,
      orderDate,
      expectedDeliverDate,
      status,
      locationID,
      createdByID,
      modifiedByID,
      referenceNo,
      remarks,
      purchaseOrderItems,
    }: {
      supplierID: number;
      orderDate: Date;
      expectedDeliverDate: Date;
      status: string;
      locationID: number;
      createdByID: number;
      modifiedByID: number | null;
      referenceNo: string | null;
      remarks: string | null;
      purchaseOrderItems: { itemID: number; orderQty: number }[];
    } = req.body;

    try {
      // Get the latest poNumber
      const lastPurchaseOrder = await prisma.purchaseOrder.findFirst({
        orderBy: { poNumber: "desc" },
        select: { poNumber: true },
      });

      const newPoNumber = lastPurchaseOrder
        ? lastPurchaseOrder.poNumber + 1
        : 10000;

      // Fetch the cost for each item in the purchase order
      const itemsWithCost = await prisma.items.findMany({
        where: {
          itemID: {
            in: purchaseOrderItems.map((item) => item.itemID),
          },
        },
        select: {
          itemID: true,
          cost: true,
        },
      });

      // Map purchase order items with the fetched cost (renamed to unitCost)
      const purchaseOrderItemsWithCost = purchaseOrderItems.map((orderItem) => {
        const item = itemsWithCost.find((i) => i.itemID === orderItem.itemID);
        return {
          poID: null,
          itemID: orderItem.itemID,
          uom: "PCS",
          unitCost: item?.cost || 0,
          orderQty: orderItem.orderQty,
        };
      });

      // Calculate totalCost by summing up unitCost * orderQty for each item
      const totalCost = purchaseOrderItemsWithCost.reduce((sum, item) => {
        return sum + item.unitCost * item.orderQty;
      }, 0);

      // Start the transaction
      const result = await prisma.$transaction(async (prisma) => {
        // Create the purchase order
        const newPurchaseOrder = await prisma.purchaseOrder.create({
          data: {
            poNumber: newPoNumber,
            supplierID,
            orderDate,
            expectedDeliverDate,
            status,
            locationID,
            createdByID,
            modifiedByID,
            referenceNo,
            remarks,
            totalCost,
          },
        });

        const purchaseOrderItemsWithPoID = purchaseOrderItemsWithCost.map(
          (item) => ({
            ...item,
            poID: newPurchaseOrder.poID,
          })
        );

        const newPurchaseOrderItems = await prisma.purchaseOrderItem.createMany(
          {
            data: purchaseOrderItemsWithPoID,
          }
        );

        return {
          newPurchaseOrder,
          newPurchaseOrderItems,
        };
      });

      logger.info(
        `Purchase Order created with PO Number ${newPoNumber}, Supplier ID ${supplierID}`
      );

      res.status(201).json({
        success: true,
        message: "Purchase Order and Purchase Order Items created successfully",
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(
          `Error creating purchase order and items: ${error.message}`
        );
        res.status(500).json({
          success: false,
          message: "Error creating purchase order and items",
          error: error.message,
        });
      } else {
        logger.error(
          "Unknown error occurred during purchase order and item creation"
        );
        res.status(500).json({
          success: false,
          message: "Unknown error",
        });
      }
    }
  }

  // Get all PurchaseOrders
  async getAllPurchaseOrders(req: Request, res: Response): Promise<void> {
    try {
      const purchaseOrders = await prisma.purchaseOrder.findMany({
        include: {
          supplier: true,
          location: true,
        },
      });
      logger.info("Fetched all purchase orders");

      res.status(200).json({
        success: true,
        data: purchaseOrders,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching purchase orders: ${error.message}`);
        throw new CustomError("Error fetching purchase orders", 500);
      } else {
        logger.error("Unknown error occurred while fetching purchase orders");
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Get PurchaseOrder by ID
  async getPurchaseOrderById(req: Request, res: Response): Promise<void> {
    const { poID } = req.params;

    try {
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { poID: parseInt(poID) },
      });

      if (!purchaseOrder) {
        logger.warn(`Purchase Order with ID ${poID} not found`);
        res.status(404).json({
          success: false,
          message: "Purchase Order not found",
        });
      } else {
        logger.info(`Fetched Purchase Order with ID ${poID}`);
        res.status(200).json({
          success: true,
          data: purchaseOrder,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching purchase order: ${error.message}`);
        throw new CustomError("Error fetching purchase order", 500);
      } else {
        logger.error("Unknown error occurred while fetching purchase order");
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Update PurchaseOrder
  async updatePurchaseOrder(req: Request, res: Response): Promise<void> {
    const { poID } = req.params;
    const {
      poNumber,
      supplierID,
      orderDate,
      expectedDeliverDate,
      status,
      locationID,
      modifiedByID,
    } = req.body;

    try {
      const updatedPurchaseOrder = await prisma.purchaseOrder.update({
        where: { poID: parseInt(poID) },
        data: {
          poNumber,
          supplierID,
          orderDate,
          expectedDeliverDate,
          status,
          locationID,
          modifiedByID,
        },
      });

      logger.info(`Purchase Order with ID ${poID} updated`);

      res.status(200).json({
        success: true,
        message: "Purchase Order updated successfully",
        data: updatedPurchaseOrder,
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error updating purchase order: ${error.message}`);
        throw new CustomError("Error updating purchase order", 500);
      } else {
        logger.error("Unknown error occurred while updating purchase order");
        throw new CustomError("Unknown error", 500);
      }
    }
  }

  // Delete PurchaseOrder
  async deletePurchaseOrder(req: Request, res: Response): Promise<void> {
    const { poID } = req.params;

    try {
      await prisma.purchaseOrder.delete({
        where: { poID: parseInt(poID) },
      });

      logger.info(`Purchase Order with ID ${poID} deleted`);

      res.status(200).json({
        success: true,
        message: "Purchase Order deleted successfully",
      });
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error deleting purchase order: ${error.message}`);
        throw new CustomError("Error deleting purchase order", 500);
      } else {
        logger.error("Unknown error occurred while deleting purchase order");
        throw new CustomError("Unknown error", 500);
      }
    }
  }
}
