/*
  Warnings:

  - You are about to drop the column `salesTransactionCustomerID` on the `salestransaction` table. All the data in the column will be lost.
  - You are about to drop the `salestransactioncustomer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `customerID` to the `salesTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `salestransaction` DROP FOREIGN KEY `salesTransaction_salesTransactionCustomerID_fkey`;

-- AlterTable
ALTER TABLE `salestransaction` DROP COLUMN `salesTransactionCustomerID`,
    ADD COLUMN `customerID` INTEGER NOT NULL;

-- DropTable
DROP TABLE `salestransactioncustomer`;

-- CreateIndex
CREATE INDEX `salesTransaction_customerID_idx` ON `salesTransaction`(`customerID`);

-- AddForeignKey
ALTER TABLE `salesTransaction` ADD CONSTRAINT `salesTransaction_customerID_fkey` FOREIGN KEY (`customerID`) REFERENCES `customers`(`customerID`) ON DELETE RESTRICT ON UPDATE CASCADE;
