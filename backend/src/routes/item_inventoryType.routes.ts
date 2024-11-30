import { Router } from "express";
import { InventoryTypeController } from "../controller/item_inventoryTypeController";

const router = Router();
const inventoryTypeController = new InventoryTypeController();

router.post("/inventory-type", inventoryTypeController.createInventoryType);
router.get("/inventory-type", inventoryTypeController.getAllInventoryTypes);
router.get(
  "/inventory-type/:inventoryTypeID",
  inventoryTypeController.getInventoryTypeById
);
router.put(
  "/inventory-type/:inventoryTypeID",
  inventoryTypeController.updateInventoryType
);
router.delete(
  "/inventory-type/:inventoryTypeID",
  inventoryTypeController.deleteInventoryType
);

export default router;
