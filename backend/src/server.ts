import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import bodyParser from "body-parser";
import multer from "multer";
import compression from "compression";
import rateLimit from "express-rate-limit";
import "colors";
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

// Inventory Item Routes
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import categoryRoutes from "./routes/item_category.routes";
import supplierRoutes from "./routes/item_supplier.routes";
import locationRoutes from "./routes/item_location.routes";
import itemRoutes from "./routes/item_item.routes";
import inventoryRoutes from "./routes/item_inventory.routes";
import inventoryTypeRoutes from "./routes/item_inventoryType.routes";
import inventoryAdjustmentRoutes from "./routes/item_inventoryAdjustment.routes";
import adjustmentTypeRoutes from "./routes/item_adjustmentType.routes";
import adjustmentReasonRoutes from "./routes/item_adjustmentReason.routes";
import itemForInventory from "./routes/itemForInventory.routes";

// Purchase Order Routes
import purchaseOrderRoutes from "./routes/po_purchaseOrder.routes";
import purchaseOrderItemRoutes from "./routes/po_purchaseOrderItem.routes";
import poReceivingItemRoutes from "./routes/po_poReceivingItem.routes";
import poReceivingRoutes from "./routes/po_poReceiving.routes";
import poSupplierRoutes from "./routes/po_supplier.routes";
import purchaseOrder from "./routes/purchaseOrder.routes";
import purchaseOrderApprovalRoutes from "./routes/purchaseOrderButton.routes";

// Company Profile Route
import companyProfleRoutes from "./routes/companyProfile.routes";

// Customer Route
import customerRoutes from "./routes/customer.routes";
import customerTypeRoutes from "./routes/customerTypes.routes";

// Sales Transaction Routes
import salesTransactionPaymentTypeRoutes from "./routes/salesTransactionPaymentType.routes";
import salesTransactionType from "./routes/salesTransactionType.routes";
import salesTransactionRoutes from "./routes/salesTransaction.routes";
import salesReportRoutes from "./routes/salesReport.routes";

// Initialize express app
const app = express();

app.use("/uploads", express.static("uploads"));

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(compression());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  next();
});

// Enable trust proxy for reverse proxies (e.g., Nginx, Heroku)
app.set("trust proxy", 1);

// Your rate-limiter configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later",
});

// Apply rate limiting to all requests
app.use(limiter);

// Multer for file uploads
const upload = multer({ dest: "uploads/" });
app.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  res.send("File uploaded successfully.");
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
});

// Passport for authentication
app.use(passport.initialize());

// Inventory Item API
app.use("/api/v1", authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", categoryRoutes);
app.use("/api/v1", supplierRoutes);
app.use("/api/v1", locationRoutes);
app.use("/api/v1", itemRoutes);
app.use("/api/v1", inventoryRoutes);
app.use("/api/v1", inventoryTypeRoutes);
app.use("/api/v1", inventoryAdjustmentRoutes);
app.use("/api/v1", adjustmentTypeRoutes);
app.use("/api/v1", adjustmentReasonRoutes);
app.use("/api/v2", companyProfleRoutes);
app.use("/api/v2", itemForInventory);

// purchase order API
app.use("/api/v2", purchaseOrderRoutes);
app.use("/api/v2", purchaseOrderItemRoutes);
app.use("/api/v2", poReceivingItemRoutes);
app.use("/api/v2", poReceivingRoutes);
app.use("/api/v2", poSupplierRoutes);
app.use("/api/v2/po", purchaseOrder);
app.use("/api/v2", purchaseOrderApprovalRoutes);

// Customer API
app.use("/api/v2", customerRoutes);
app.use("/api/v2", customerTypeRoutes);

// Sales Transaction API
app.use("/api/v3/transaction", salesTransactionPaymentTypeRoutes);
app.use("/api/v3/transaction", salesTransactionType);
app.use("/api/v3/transaction", salesTransactionRoutes);
app.use("/api/v3", salesReportRoutes);
// This could override other route handlers
app.use("*", (req, res) => {
  res.status(404).send("Not Found");
});

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`.yellow.bold);
});

export default app;
