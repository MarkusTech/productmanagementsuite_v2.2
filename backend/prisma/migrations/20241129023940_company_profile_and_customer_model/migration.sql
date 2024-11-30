-- CreateTable
CREATE TABLE `companyProfile` (
    `companyID` INTEGER NOT NULL AUTO_INCREMENT,
    `companyLogo_url` VARCHAR(191) NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `registrationNumber` INTEGER NOT NULL,
    `companyAddress` VARCHAR(191) NULL,
    `companyEmail` VARCHAR(191) NULL,
    `companyPhone` VARCHAR(191) NULL,
    `companyPhoneSecondary` VARCHAR(191) NULL,
    `taxDetails` INTEGER NOT NULL,
    `createdByID` INTEGER NOT NULL,
    `modifiedByID` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`companyID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customers` (
    `customerID` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `middleName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `contactNo` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdByID` INTEGER NOT NULL,
    `modifiedByID` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`customerID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customerType` (
    `customerTypeID` INTEGER NOT NULL AUTO_INCREMENT,
    `customerID` INTEGER NOT NULL,
    `TypeName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdByID` INTEGER NOT NULL,
    `modifiedByID` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`customerTypeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `customerType` ADD CONSTRAINT `customerType_customerID_fkey` FOREIGN KEY (`customerID`) REFERENCES `customers`(`customerID`) ON DELETE RESTRICT ON UPDATE CASCADE;
