-- CreateTable
CREATE TABLE `Users` (
    `userID` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `middleName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `roleID` INTEGER NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `birthday` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `image_url` VARCHAR(191) NULL,
    `createdByID` INTEGER NOT NULL,
    `modifiedByID` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_username_key`(`username`),
    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `roleID` INTEGER NOT NULL AUTO_INCREMENT,
    `roleName` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `UserRole_roleName_key`(`roleName`),
    PRIMARY KEY (`roleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categories` (
    `categoryID` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryCode` VARCHAR(191) NOT NULL,
    `categoryName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Categories_categoryCode_key`(`categoryCode`),
    PRIMARY KEY (`categoryID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Locations` (
    `locationID` INTEGER NOT NULL AUTO_INCREMENT,
    `locationName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdByID` INTEGER NOT NULL,
    `modifiedByID` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`locationID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Suppliers` (
    `supplierID` INTEGER NOT NULL AUTO_INCREMENT,
    `supplierName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`supplierID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Items` (
    `itemID` INTEGER NOT NULL AUTO_INCREMENT,
    `itemCode` VARCHAR(191) NOT NULL,
    `categoryID` INTEGER NOT NULL,
    `barcode` VARCHAR(191) NOT NULL,
    `itemName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `grams` DOUBLE NOT NULL,
    `uom` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `cost` DOUBLE NOT NULL,
    `image_url` VARCHAR(191) NULL,
    `createdByID` INTEGER NOT NULL,
    `modifiedByID` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Items_itemCode_key`(`itemCode`),
    PRIMARY KEY (`itemID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventory` (
    `inventoryID` INTEGER NOT NULL AUTO_INCREMENT,
    `locationID` INTEGER NOT NULL,
    `itemID` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL,
    `inventoryTypeID` INTEGER NOT NULL,
    `reOrderThreshold` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`inventoryID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryType` (
    `inventoryTypeID` INTEGER NOT NULL AUTO_INCREMENT,
    `typeName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `createdByID` INTEGER NOT NULL,
    `modifiedByID` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`inventoryTypeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InventoryAdjustment` (
    `adjustmentID` INTEGER NOT NULL AUTO_INCREMENT,
    `inventoryID` INTEGER NOT NULL,
    `adjustmentTypeID` INTEGER NOT NULL,
    `adjustmentReasonID` INTEGER NOT NULL,
    `quantityAdjusted` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdByID` INTEGER NOT NULL,
    `modifiedByID` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`adjustmentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdjustmentType` (
    `adjustmentTypeID` INTEGER NOT NULL AUTO_INCREMENT,
    `typeName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdByID` INTEGER NOT NULL,
    `modifiedByID` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`adjustmentTypeID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdjustmentReason` (
    `adjustmentReasonID` INTEGER NOT NULL AUTO_INCREMENT,
    `reasonName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdByID` INTEGER NOT NULL,
    `modifiedByID` INTEGER NULL,

    PRIMARY KEY (`adjustmentReasonID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseOrder` (
    `poID` INTEGER NOT NULL AUTO_INCREMENT,
    `poNumber` INTEGER NOT NULL,
    `supplierID` INTEGER NOT NULL,
    `orderDate` DATETIME(3) NOT NULL,
    `expectedDeliverDate` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `locationID` INTEGER NOT NULL,
    `createdByID` INTEGER NOT NULL,
    `modifiedByID` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PurchaseOrder_poNumber_key`(`poNumber`),
    PRIMARY KEY (`poID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseOrderItem` (
    `poItemID` INTEGER NOT NULL AUTO_INCREMENT,
    `poID` INTEGER NOT NULL,
    `itemID` INTEGER NOT NULL,
    `uom` VARCHAR(191) NOT NULL,
    `unitCost` DOUBLE NOT NULL,
    `orderQty` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`poItemID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `poReceivingItem` (
    `poReceivingItemID` INTEGER NOT NULL AUTO_INCREMENT,
    `itemID` INTEGER NOT NULL,
    `uom` VARCHAR(191) NOT NULL,
    `receivedQty` INTEGER NOT NULL,
    `unitCost` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`poReceivingItemID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `poReceiving` (
    `poReceivingID` INTEGER NOT NULL AUTO_INCREMENT,
    `poID` INTEGER NOT NULL,
    `receivedDate` DATETIME(3) NOT NULL,
    `referenceNumber` VARCHAR(191) NOT NULL,
    `totalCost` DOUBLE NOT NULL,
    `totalQty` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `receivedByID` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`poReceivingID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `poSupplier` (
    `supplierID` INTEGER NOT NULL AUTO_INCREMENT,
    `supplierName` VARCHAR(191) NOT NULL,
    `contactDetails` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `createdByID` INTEGER NOT NULL,
    `modifiedByID` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`supplierID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_roleID_fkey` FOREIGN KEY (`roleID`) REFERENCES `UserRole`(`roleID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Items` ADD CONSTRAINT `Items_categoryID_fkey` FOREIGN KEY (`categoryID`) REFERENCES `Categories`(`categoryID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_itemID_fkey` FOREIGN KEY (`itemID`) REFERENCES `Items`(`itemID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_locationID_fkey` FOREIGN KEY (`locationID`) REFERENCES `Locations`(`locationID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_inventoryTypeID_fkey` FOREIGN KEY (`inventoryTypeID`) REFERENCES `InventoryType`(`inventoryTypeID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryAdjustment` ADD CONSTRAINT `InventoryAdjustment_inventoryID_fkey` FOREIGN KEY (`inventoryID`) REFERENCES `Inventory`(`inventoryID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryAdjustment` ADD CONSTRAINT `InventoryAdjustment_adjustmentTypeID_fkey` FOREIGN KEY (`adjustmentTypeID`) REFERENCES `AdjustmentType`(`adjustmentTypeID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InventoryAdjustment` ADD CONSTRAINT `InventoryAdjustment_adjustmentReasonID_fkey` FOREIGN KEY (`adjustmentReasonID`) REFERENCES `AdjustmentReason`(`adjustmentReasonID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `poReceivingItem` ADD CONSTRAINT `poReceivingItem_itemID_fkey` FOREIGN KEY (`itemID`) REFERENCES `Items`(`itemID`) ON DELETE RESTRICT ON UPDATE CASCADE;
