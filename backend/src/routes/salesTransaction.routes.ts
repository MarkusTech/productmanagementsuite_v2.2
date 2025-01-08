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

// routes to save items
router.post(
  "/saveSalesItems",
  salesTransactionController.createSalesTransactionItems
);

// routes ro update sales items
router.put(
  "/updateSalesItems",
  salesTransactionController.updateSalesTransactionItem
);

router.post(
  "/saveSalesCustomer",
  salesTransactionController.saveSalesTransactionCustomer
);

router.put(
  "/updateSalesCustomer",
  salesTransactionController.updateSalesTransactionCustomer
);

router.delete(
  "/delete-transaction/:salesTransactionID",
  salesTransactionController.deleteSalesTransaction
);

export default router;
