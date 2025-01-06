import { Router } from "express";
import { PurchaseOrderApprovalController } from "./../controller/purchaseOrderApprovalController";

const router = Router();
const purchaseOrderApprovalController = new PurchaseOrderApprovalController();

// Route to cancel a purchase order
router.put(
  "/purchase-orders/cancel/:poID",
  purchaseOrderApprovalController.cancelPurchaseOrder
);

// Route to approve a purchase order
router.put(
  "/purchase-orders/approve/:poID",
  purchaseOrderApprovalController.approvePurchaseOrder
);

export default router;
