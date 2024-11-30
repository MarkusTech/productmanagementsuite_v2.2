/*
  Warnings:

  - You are about to drop the column `customerID` on the `salestransaction` table. All the data in the column will be lost.
  - You are about to drop the column `itemID` on the `salestransaction` table. All the data in the column will be lost.
  - Added the required column `salesTransactionCustomerID` to the `salesTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `salestransaction` DROP FOREIGN KEY `salesTransaction_customerID_fkey`;

-- DropForeignKey
ALTER TABLE `salestransaction` DROP FOREIGN KEY `salesTransaction_itemID_fkey`;

-- AlterTable
ALTER TABLE `salestransaction` DROP COLUMN `customerID`,
    DROP COLUMN `itemID`,
    ADD COLUMN `salesTransactionCustomerID` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `salesTransactionCustomer` (
    `salesTransactionCustomerID` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `middleName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `contactNo` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `customerTypeID` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `customerType` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`salesTransactionCustomerID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `salesTransactionItems` (
    `salesTransactionItemID` INTEGER NOT NULL AUTO_INCREMENT,
    `salesTransactionID` INTEGER NOT NULL,
    `itemID` INTEGER NOT NULL,
    `qty` INTEGER NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `total` DECIMAL(65, 30) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`salesTransactionItemID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `salesTransaction_salesTransactionCustomerID_idx` ON `salesTransaction`(`salesTransactionCustomerID`);

-- AddForeignKey
ALTER TABLE `salesTransaction` ADD CONSTRAINT `salesTransaction_salesTransactionCustomerID_fkey` FOREIGN KEY (`salesTransactionCustomerID`) REFERENCES `salesTransactionCustomer`(`salesTransactionCustomerID`) ON DELETE RESTRICT ON UPDATE CASCADE;
