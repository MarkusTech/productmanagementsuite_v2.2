-- AddForeignKey
ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_poID_fkey` FOREIGN KEY (`poID`) REFERENCES `PurchaseOrder`(`poID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrderItem` ADD CONSTRAINT `PurchaseOrderItem_itemID_fkey` FOREIGN KEY (`itemID`) REFERENCES `Items`(`itemID`) ON DELETE RESTRICT ON UPDATE CASCADE;
