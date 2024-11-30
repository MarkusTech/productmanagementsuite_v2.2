-- CreateTable
CREATE TABLE `salesTransaction` (
    `salesTransactionID` INTEGER NOT NULL AUTO_INCREMENT,
    `locationID` INTEGER NOT NULL,
    `customerID` INTEGER NOT NULL,
    `itemID` INTEGER NOT NULL,
    `qty` INTEGER NOT NULL,
    `price` DECIMAL(65, 30) NOT NULL,
    `total` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    `paymentTypeID` INTEGER NOT NULL,
    `transactionTypeID` INTEGER NOT NULL,
    `transactionNumber` INTEGER NOT NULL,
    `transactionDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL,
    `totalItems` INTEGER NOT NULL,
    `totalQuantity` INTEGER NOT NULL,
    `totalPurchase` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`salesTransactionID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactionType` (
    `transactionTypeID` INTEGER NOT NULL AUTO_INCREMENT,
    `transactionName` VARCHAR(191) NOT NULL,
    `createdByID` INTEGER NOT NULL,
    `modifiedByID` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`transactionTypeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `paymentType` (
    `paymentTypeID` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentName` VARCHAR(191) NOT NULL,
    `createdByID` INTEGER NOT NULL,
    `modifiedByID` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`paymentTypeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `salesTransaction` ADD CONSTRAINT `salesTransaction_locationID_fkey` FOREIGN KEY (`locationID`) REFERENCES `Locations`(`locationID`) ON DELETE RESTRICT ON UPDATE CASCADE;
