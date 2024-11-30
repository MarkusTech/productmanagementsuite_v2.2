import express from "express";
import { PaymentTypeController } from "../controller/salesTransactionPaymentType";

const router = express.Router();
const paymentTypeController = new PaymentTypeController();

// Route to create a payment type
router.post("/payment-types", paymentTypeController.createPaymentType);

// Route to get all payment types
router.get("/payment-types", paymentTypeController.getAllPaymentTypes);

// Route to get a payment type by ID
router.get(
  "/payment-types/:paymentTypeID",
  paymentTypeController.getPaymentTypeById
);

// Route to update a payment type
router.put(
  "/payment-types/:paymentTypeID",
  paymentTypeController.updatePaymentType
);

export default router;
