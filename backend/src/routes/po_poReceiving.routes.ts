import { Router } from "express";
import { PoReceivingController } from "../controller/po_poReceivingController";

const router = Router();
const poReceivingController = new PoReceivingController();

router.post("/po-receiving", poReceivingController.createPoReceiving);
router.get("/po-receiving", poReceivingController.getAllPoReceiving);
router.get(
  "/po-receiving/:poReceivingID",
  poReceivingController.getPoReceivingById
);
router.put(
  "/po-receiving/:poReceivingID",
  poReceivingController.updatePoReceiving
);
router.delete(
  "/po-receiving/:poReceivingID",
  poReceivingController.deletePoReceiving
);

export default router;
