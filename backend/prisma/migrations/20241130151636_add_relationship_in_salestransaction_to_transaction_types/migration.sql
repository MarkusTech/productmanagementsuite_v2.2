-- AddForeignKey
ALTER TABLE `salesTransaction` ADD CONSTRAINT `salesTransaction_transactionTypeID_fkey` FOREIGN KEY (`transactionTypeID`) REFERENCES `transactionType`(`transactionTypeID`) ON DELETE RESTRICT ON UPDATE CASCADE;
