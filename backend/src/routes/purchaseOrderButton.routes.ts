import { Router } from "express";
import { PurchaseOrderApprovalController } from "./../controller/purchaseOrderApprovalController";

const router = Router();
const purchaseOrderApprovalController = new PurchaseOrderApprovalController();

router.put(
  "/purchase-orders/cancel/:poID",
  purchaseOrderApprovalController.cancelPurchaseOrder
);

export default router;
