import { Router } from "express";
import { SupplierController } from "../controller/item_supplierController";

const router = Router();
const supplierController = new SupplierController();

router.post("/suppliers", supplierController.createSupplier);
router.get("/suppliers", supplierController.getAllSuppliers);
router.get("/suppliers/:supplierID", supplierController.getSupplierById);
router.put("/suppliers/:supplierID", supplierController.updateSupplier);
router.delete("/suppliers/:supplierID", supplierController.deleteSupplier);

export default router;
