import { Request, Response } from "express";
import logger from "../utils/logger";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class PurchaseOrderApprovalController {
  async cancelPurchaseOrder(req: Request, res: Response): Promise<void> {
    const { poID } = req.params;

    try {
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { poID: parseInt(poID) },
        select: { status: true },
      });

      if (!purchaseOrder) {
        res.status(404).json({
          success: false,
          message: "Purchase Order not found",
        });
        return;
      }

      if (purchaseOrder.status !== "Pending") {
        res.status(400).json({
          success: false,
          message: `Status is already ${purchaseOrder.status}.`,
        });
        return;
      }

      // Update the status of the purchase order to 'Canceled'
      const updatedPurchaseOrder = await prisma.purchaseOrder.update({
        where: { poID: parseInt(poID) },
        data: { status: "Canceled" },
      });

      res.status(200).json({
        success: true,
        message: "Purchase Order canceled successfully",
        data: updatedPurchaseOrder,
      });
    } catch (error) {
      logger.error(`Error canceling purchase order: ${error}`);
      res.status(500).json({
        success: false,
        message: "Error canceling purchase order",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async approvePurchaseOrder(req: Request, res: Response): Promise<void> {
    const { poID } = req.params;

    try {
      const purchaseOrder = await prisma.purchaseOrder.findUnique({
        where: { poID: parseInt(poID) },
        select: { status: true },
      });

      if (!purchaseOrder) {
        res.status(404).json({
          success: false,
          message: "Purchase Order not found",
        });
        return;
      }

      if (purchaseOrder.status !== "Pending") {
        res.status(400).json({
          success: false,
          message: `Status is already ${purchaseOrder.status}.`,
        });
        return;
      }

      const updatedPurchaseOrder = await prisma.purchaseOrder.update({
        where: { poID: parseInt(poID) },
        data: { status: "Approved" },
      });

      res.status(200).json({
        success: true,
        message: "Purchase Order approved successfully",
        data: updatedPurchaseOrder,
      });
    } catch (error) {
      logger.error(`Error approving purchase order: ${error}`);
      res.status(500).json({
        success: false,
        message: "Error approving purchase order",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
