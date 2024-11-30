import { Router } from "express";
import { PoReceivingItemController } from "../controller/po_poReceivingItemController";

const router = Router();
const poReceivingItemController = new PoReceivingItemController();

router.post(
  "/po-receiving-items",
  poReceivingItemController.createPoReceivingItem
);
router.get(
  "/po-receiving-items",
  poReceivingItemController.getAllPoReceivingItems
);
router.get(
  "/po-receiving-items/:poReceivingItemID",
  poReceivingItemController.getPoReceivingItemById
);
router.put(
  "/po-receiving-items/:poReceivingItemID",
  poReceivingItemController.updatePoReceivingItem
);
router.delete(
  "/po-receiving-items/:poReceivingItemID",
  poReceivingItemController.deletePoReceivingItem
);

export default router;
