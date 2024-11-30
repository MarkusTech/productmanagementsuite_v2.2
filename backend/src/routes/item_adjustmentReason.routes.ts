import { Router } from "express";
import { AdjustmentReasonController } from "../controller/item_adjustmentReasonController";

const router = Router();
const adjustmentReasonController = new AdjustmentReasonController();

router.post(
  "/adjustment-reason",

  adjustmentReasonController.createAdjustmentReason
);
router.get(
  "/adjustment-reason",

  adjustmentReasonController.getAllAdjustmentReasons
);
router.get(
  "/adjustment-reason/:adjustmentReasonID",

  adjustmentReasonController.getAdjustmentReasonById
);
router.put(
  "/adjustment-reason/:adjustmentReasonID",

  adjustmentReasonController.updateAdjustmentReason
);
router.delete(
  "/adjustment-reason/:adjustmentReasonID",

  adjustmentReasonController.deleteAdjustmentReason
);

export default router;
