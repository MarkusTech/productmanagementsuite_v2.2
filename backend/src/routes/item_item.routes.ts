import { Router } from "express";
import { ItemController } from "../controller/item_itemController";
import upload from "../config/multerItem";

const router = Router();
const itemController = new ItemController();

router.get("/items", itemController.getAllItems);
router.get("/items/:itemID", itemController.getItemById);
router.put("/items/:itemID", itemController.updateItem);
router.delete("/items/:itemID", itemController.deleteItem);
router.post(
  "/item-inventory",
  upload.array("images", 5),
  itemController.createItemAndSaveToInventory.bind(itemController)
);
router.get("/item-images/:itemID", itemController.getItemAndImageById);

export default router;
