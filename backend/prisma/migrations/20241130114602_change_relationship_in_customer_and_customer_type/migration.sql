/*
  Warnings:

  - You are about to drop the column `customerID` on the `customertype` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `customertype` DROP FOREIGN KEY `customerType_customerID_fkey`;

-- AlterTable
ALTER TABLE `customers` ADD COLUMN `customerTypeID` INTEGER NULL;

-- AlterTable
ALTER TABLE `customertype` DROP COLUMN `customerID`;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_customerTypeID_fkey` FOREIGN KEY (`customerTypeID`) REFERENCES `customerType`(`customerTypeID`) ON DELETE SET NULL ON UPDATE CASCADE;
