/*
  Warnings:

  - You are about to alter the column `price` on the `salestransaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `total` on the `salestransaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `totalPurchase` on the `salestransaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `price` on the `salestransactionitems` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.
  - You are about to alter the column `total` on the `salestransactionitems` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Double`.

*/
-- AlterTable
ALTER TABLE `salestransaction` MODIFY `price` DOUBLE NOT NULL,
    MODIFY `total` DOUBLE NOT NULL,
    MODIFY `totalPurchase` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `salestransactionitems` MODIFY `price` DOUBLE NOT NULL,
    MODIFY `total` DOUBLE NOT NULL;
