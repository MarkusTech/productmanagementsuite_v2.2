-- AddForeignKey
ALTER TABLE `salesTransaction` ADD CONSTRAINT `salesTransaction_itemID_fkey` FOREIGN KEY (`itemID`) REFERENCES `Items`(`itemID`) ON DELETE RESTRICT ON UPDATE CASCADE;
