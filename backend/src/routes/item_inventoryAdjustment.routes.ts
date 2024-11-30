import { Router } from "express";
import { InventoryAdjustmentController } from "../controller/item_inventoryAdjustmentController";

const router = Router();
const inventoryAdjustmentController = new InventoryAdjustmentController();

router.post(
  "/inventory-adjustment",
  inventoryAdjustmentController.createInventoryAdjustment
);
router.get(
  "/inventory-adjustment",
  inventoryAdjustmentController.getAllInventoryAdjustments
);
router.get(
  "/inventory-adjustment/:adjustmentID",
  inventoryAdjustmentController.getInventoryAdjustmentById
);
router.put(
  "/inventory-adjustment/:adjustmentID",
  inventoryAdjustmentController.updateInventoryAdjustment
);
router.delete(
  "/inventory-adjustment/:adjustmentID",
  inventoryAdjustmentController.deleteInventoryAdjustment
);

// New route for approving inventory adjustments
router.put(
  "/inventory-adjustment/:inventoryID/approve/:adjustmentID",
  inventoryAdjustmentController.inventoryApproved
);
router.put(
  "/inventory-adjustment/:adjustmentID/decline",
  inventoryAdjustmentController.inventoryDeclined
);

export default router;
