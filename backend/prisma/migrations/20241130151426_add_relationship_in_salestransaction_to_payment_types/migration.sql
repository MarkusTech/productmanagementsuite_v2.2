-- AddForeignKey
ALTER TABLE `salesTransaction` ADD CONSTRAINT `salesTransaction_paymentTypeID_fkey` FOREIGN KEY (`paymentTypeID`) REFERENCES `paymentType`(`paymentTypeID`) ON DELETE RESTRICT ON UPDATE CASCADE;
