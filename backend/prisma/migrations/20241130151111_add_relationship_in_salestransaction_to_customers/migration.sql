-- AddForeignKey
ALTER TABLE `salesTransaction` ADD CONSTRAINT `salesTransaction_customerID_fkey` FOREIGN KEY (`customerID`) REFERENCES `customers`(`customerID`) ON DELETE RESTRICT ON UPDATE CASCADE;
