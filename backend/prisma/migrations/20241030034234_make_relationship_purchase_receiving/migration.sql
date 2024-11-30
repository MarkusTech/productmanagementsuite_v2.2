-- AlterTable
ALTER TABLE `poreceiving` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `users` MODIFY `middleName` VARCHAR(191) NULL,
    MODIFY `modifiedByID` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `poReceiving` ADD CONSTRAINT `poReceiving_poID_fkey` FOREIGN KEY (`poID`) REFERENCES `PurchaseOrder`(`poID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `poReceiving` ADD CONSTRAINT `poReceiving_receivedByID_fkey` FOREIGN KEY (`receivedByID`) REFERENCES `Users`(`userID`) ON DELETE RESTRICT ON UPDATE CASCADE;
