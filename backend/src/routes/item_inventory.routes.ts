import { Router } from "express";
import { InventoryController } from "../controller/item_inventoryController";

const router = Router();
const inventoryController = new InventoryController();

router.post("/inventory", inventoryController.createInventory);
router.get("/inventory", inventoryController.getAllInventory);
router.get("/inventory/:inventoryID", inventoryController.getInventoryById);
router.put("/inventory/:inventoryID", inventoryController.updateInventory);
router.delete("/inventory/:inventoryID", inventoryController.deleteInventory);

export default router;
