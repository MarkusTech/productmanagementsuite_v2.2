-- AddForeignKey
ALTER TABLE `PurchaseOrder` ADD CONSTRAINT `PurchaseOrder_supplierID_fkey` FOREIGN KEY (`supplierID`) REFERENCES `poSupplier`(`supplierID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseOrder` ADD CONSTRAINT `PurchaseOrder_locationID_fkey` FOREIGN KEY (`locationID`) REFERENCES `Locations`(`locationID`) ON DELETE RESTRICT ON UPDATE CASCADE;
