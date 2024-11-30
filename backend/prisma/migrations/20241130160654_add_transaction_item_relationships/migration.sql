-- CreateIndex
CREATE INDEX `salesTransactionItems_salesTransactionID_idx` ON `salesTransactionItems`(`salesTransactionID`);

-- AddForeignKey
ALTER TABLE `salesTransactionItems` ADD CONSTRAINT `salesTransactionItems_salesTransactionID_fkey` FOREIGN KEY (`salesTransactionID`) REFERENCES `salesTransaction`(`salesTransactionID`) ON DELETE RESTRICT ON UPDATE CASCADE;
