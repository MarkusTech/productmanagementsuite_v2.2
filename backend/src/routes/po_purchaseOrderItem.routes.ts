import { Router } from "express";
import { PurchaseOrderItemController } from "../controller/po_purchaseOrderItemController";

const router = Router();
const purchaseOrderItemController = new PurchaseOrderItemController();

router.post(
  "/purchase-order-items",
  purchaseOrderItemController.createPurchaseOrderItem
);
router.get(
  "/purchase-order-items",
  purchaseOrderItemController.getAllPurchaseOrderItems
);
router.get(
  "/purchase-order-items/:poItemID",
  purchaseOrderItemController.getPurchaseOrderItemById
);
router.put(
  "/purchase-order-items/:poItemID",
  purchaseOrderItemController.updatePurchaseOrderItem
);
router.delete(
  "/purchase-order-items/:poItemID",
  purchaseOrderItemController.deletePurchaseOrderItem
);

export default router;
