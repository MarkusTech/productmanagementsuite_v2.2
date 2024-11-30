import express from "express";
import { CustomerController } from "../controller/customerController";

const router = express.Router();
const customerController = new CustomerController();

// Create customer
router.post("/customers", customerController.createCustomer);

// Get all customers
router.get("/customers", customerController.getAllCustomers);

// Get customer by ID
router.get("/customers/:customerID", customerController.getCustomerById);

// Update customer
router.put("/customers/:customerID", customerController.updateCustomer);

export default router;
