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

export default router;
