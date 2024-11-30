import { Router } from "express";
import { PurchaseOrderController } from "../controller/po_purchaseOrderController";

const router = Router();
const purchaseOrderController = new PurchaseOrderController();

router.post("/purchase-orders", purchaseOrderController.createPurchaseOrder);

router.get("/purchase-orders", purchaseOrderController.getAllPurchaseOrders);

router.get(
  "/purchase-orders/:poID",
  purchaseOrderController.getPurchaseOrderById
);

router.put(
  "/purchase-orders/:poID",
  purchaseOrderController.updatePurchaseOrder
);

router.delete(
  "/purchase-orders/:poID",
  purchaseOrderController.deletePurchaseOrder
);

export default router;
