/*
  Warnings:

  - You are about to drop the column `companyLogo_url` on the `companyprofile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `companyprofile` DROP COLUMN `companyLogo_url`,
    ADD COLUMN `image_url` VARCHAR(191) NULL;
