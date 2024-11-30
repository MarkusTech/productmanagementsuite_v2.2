import express from "express";
import { CustomerTypeController } from "../controller/customerTypeController";

const router = express.Router();
const customerTypeController = new CustomerTypeController();

// Create customer type
router.post("/customer-types", customerTypeController.createCustomerType);

// Get all customer types
router.get("/customer-types", customerTypeController.getAllCustomerTypes);

// Get customer type by ID
router.get(
  "/customer-types/:customerTypeID",
  customerTypeController.getCustomerTypeById
);

// Update customer type
router.put(
  "/customer-types/:customerTypeID",
  customerTypeController.updateCustomerType
);

export default router;
