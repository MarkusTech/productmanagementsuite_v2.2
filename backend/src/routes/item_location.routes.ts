import { Router } from "express";
import { LocationController } from "../controller/item_locationController";

const router = Router();
const locationController = new LocationController();

router.post("/locations", locationController.createLocation);
router.get("/locations", locationController.getAllLocations);
router.get("/locations/:locationID", locationController.getLocationById);
router.put("/locations/:locationID", locationController.updateLocation);
router.delete("/locations/:locationID", locationController.deleteLocation);

export default router;
