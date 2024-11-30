-- AlterTable
ALTER TABLE `purchaseorder` ADD COLUMN `referenceNo` VARCHAR(191) NULL,
    ADD COLUMN `remarks` VARCHAR(191) NULL,
    ADD COLUMN `totalCost` DOUBLE NOT NULL DEFAULT 0.0;

-- CreateIndex
CREATE INDEX `PurchaseOrder_poNumber_idx` ON `PurchaseOrder`(`poNumber`);
