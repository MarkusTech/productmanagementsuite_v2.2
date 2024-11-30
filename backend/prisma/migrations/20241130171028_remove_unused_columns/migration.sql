/*
  Warnings:

  - You are about to drop the column `price` on the `salestransaction` table. All the data in the column will be lost.
  - You are about to drop the column `qty` on the `salestransaction` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `salestransaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `salestransaction` DROP COLUMN `price`,
    DROP COLUMN `qty`,
    DROP COLUMN `total`;
