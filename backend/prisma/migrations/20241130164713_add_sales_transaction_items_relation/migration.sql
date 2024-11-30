-- DropForeignKey
ALTER TABLE `salestransactionitems` DROP FOREIGN KEY `salesTransactionItems_salesTransactionID_fkey`;

-- CreateIndex
CREATE INDEX `salesTransactionItems_salesTransactionID_itemID_idx` ON `salesTransactionItems`(`salesTransactionID`, `itemID`);

-- AddForeignKey
ALTER TABLE `salesTransactionItems` ADD CONSTRAINT `salesTransactionItems_salesTransaction_fkey` FOREIGN KEY (`salesTransactionID`) REFERENCES `salesTransaction`(`salesTransactionID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `salesTransactionItems` ADD CONSTRAINT `salesTransactionItems_item_fkey` FOREIGN KEY (`itemID`) REFERENCES `Items`(`itemID`) ON DELETE RESTRICT ON UPDATE CASCADE;
