import { Router } from "express";
import { ItemInventoryForSales } from "../controller/itemInventoryForSales";

const router = Router();
const itemInventoryForSales = new ItemInventoryForSales();

router.get(
  "/inventory-items/sellable/:locationID",
  itemInventoryForSales.getInventoryItems
);

//http://localhost:5000/api/v2/inventory-items/sellable/1

export default router;
