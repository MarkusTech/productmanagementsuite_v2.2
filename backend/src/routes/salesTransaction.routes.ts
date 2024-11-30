import express from "express";
import { SalesTransactionController } from "../controller/salesTransactionController";

const router = express.Router();
const salesTransactionController = new SalesTransactionController();

// Route to create a new sales transaction
router.post("/", salesTransactionController.createSalesTransaction);

// Route to get all sales transactions
router.get("/", salesTransactionController.getAllSalesTransactions);

// Route to get a sales transaction by ID
router.get(
  "/:salesTransactionID",
  salesTransactionController.getSalesTransactionById
);

export default router;
