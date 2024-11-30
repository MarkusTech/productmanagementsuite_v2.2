import { Router } from "express";
import { PoSupplierController } from "../controller/po_supplierController";

const router = Router();
const poSupplierController = new PoSupplierController();

router.post("/suppliers", poSupplierController.createSupplier);
router.get("/suppliers", poSupplierController.getAllSuppliers);
router.get("/suppliers/:supplierID", poSupplierController.getSupplierById);
router.put("/suppliers/:supplierID", poSupplierController.updateSupplier);
router.delete("/suppliers/:supplierID", poSupplierController.deleteSupplier);

export default router;
