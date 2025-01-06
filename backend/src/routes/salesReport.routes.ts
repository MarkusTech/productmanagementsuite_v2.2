import { Router } from "express";
import { SalesReportController } from "../controller/salesReportController";

const router = Router();
const salesReportController = new SalesReportController();

router.get("/sales-report/daily", salesReportController.getDailySalesReport);
router.get("/sales-report/weekly", salesReportController.getWeeklySalesReport);
router.get(
  "/sales-report/monthly",
  salesReportController.getMonthlySalesReport
);
router.get("/total-sales", salesReportController.getTotalSales);
router.get("/paid-orders", salesReportController.getCompletedSalesCount);
router.get("/sales-summary", salesReportController.getTransactionSummary);

export default router;
