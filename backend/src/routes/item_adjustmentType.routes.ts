import { Router } from "express";
import { AdjustmentTypeController } from "../controller/item_adjustmentTypeController";

const router = Router();
const adjustmentTypeController = new AdjustmentTypeController();

router.post("/adjustment-type", adjustmentTypeController.createAdjustmentType);
router.get("/adjustment-type", adjustmentTypeController.getAllAdjustmentTypes);
router.get(
  "/adjustment-type/:adjustmentTypeID",
  adjustmentTypeController.getAdjustmentTypeById
);
router.put(
  "/adjustment-type/:adjustmentTypeID",
  adjustmentTypeController.updateAdjustmentType
);
router.delete(
  "/adjustment-type/:adjustmentTypeID",
  adjustmentTypeController.deleteAdjustmentType
);

export default router;
