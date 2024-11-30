import express from "express";
import { TransactionTypeController } from "../controller/salesTransactionType";

const router = express.Router();
const transactionTypeController = new TransactionTypeController();

// Route to create a transaction type
router.post(
  "/transaction-types",
  transactionTypeController.createTransactionType
);

// Route to get all transaction types
router.get(
  "/transaction-types",
  transactionTypeController.getAllTransactionTypes
);

// Route to get a transaction type by ID
router.get(
  "/transaction-types/:transactionTypeID",
  transactionTypeController.getTransactionTypeById
);

// Route to update a transaction type
router.put(
  "/transaction-types/:transactionTypeID",
  transactionTypeController.updateTransactionType
);

export default router;
