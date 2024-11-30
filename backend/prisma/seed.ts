import { PrismaClient } from "@prisma/client";
import process from "process";

const prisma = new PrismaClient();

async function main() {
  // Seed User Roles
  const roles = await Promise.all(
    Array.from({ length: 4 }, (_, i) =>
      prisma.userRole.create({
        data: {
          roleName: `Role ${i + 1}`,
        },
      })
    )
  );

  // Seed Adjustment Types
  const adjustmentTypes = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.adjustmentType.create({
        data: {
          typeName: `Adjustment Type ${i + 1}`,
          createdByID: (i % 3) + 1,
          modifiedByID: (i % 3) + 1,
        },
      })
    )
  );

  // Seed Adjustment Reasons
  const adjustmentReasons = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.adjustmentReason.create({
        data: {
          reasonName: `Reason ${i + 1}`,
          createdByID: (i % 3) + 1,
          modifiedByID: (i % 3) + 1,
        },
      })
    )
  );

  // Seed Users
  const users = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.users.create({
        data: {
          firstName: `FirstName${i + 1}`,
          middleName: `MiddleName${i + 1}`,
          lastName: `LastName${i + 1}`,
          roleID: (i % roles.length) + 1, // Use the length of roles
          username: `user${i + 1}`,
          email: `user${i + 1}@example.com`,
          password: `password${i + 1}`,
          phoneNumber: `091234567${i + 1}`,
          address: `Address ${i + 1}`,
          birthday: `199${i}-01-01`,
          status: true,
          image_url: `https://example.com/image${i + 1}.png`,
          createdByID: (i % 3) + 1,
          modifiedByID: (i % 3) + 1,
        },
      })
    )
  );

  // Seed Categories
  const categories = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.categories.create({
        data: {
          categoryCode: `CAT${i + 1}`,
          categoryName: `Category Name ${i + 1}`,
          description: `Description for Category ${i + 1}`,
          status: true,
        },
      })
    )
  );

  // Seed Locations
  const locations = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.locations.create({
        data: {
          locationName: `Location ${i + 1}`,
          description: `Description for Location ${i + 1}`,
          status: true,
          createdByID: (i % 3) + 1,
          modifiedByID: (i % 3) + 1,
        },
      })
    )
  );

  // Seed Suppliers
  const suppliers = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.suppliers.create({
        data: {
          supplierName: `Supplier ${i + 1}`,
          description: `Description for Supplier ${i + 1}`,
          status: true,
        },
      })
    )
  );

  // Seed Items
  const items = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.items.create({
        data: {
          itemCode: `ITEM${i + 1}`,
          categoryID: categories[i % categories.length].categoryID,
          barcode: `BARCODE${i + 1}`,
          itemName: `Item Name ${i + 1}`,
          description: `Description for Item ${i + 1}`,
          grams: 100 + i,
          uom: `UOM${i + 1}`,
          price: 100 + i * 10,
          cost: 50 + i * 5,
          image_url: `https://example.com/item${i + 1}.png`,
          createdByID: (i % 3) + 1,
          modifiedByID: (i % 3) + 1,
          status: true,
        },
      })
    )
  );

  // Seed Inventory Type
  const inventoryTypes = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.inventoryType.create({
        data: {
          typeName: `Inventory Type ${i + 1}`,
          description: `Description for Inventory Type ${i + 1}`,
          status: true,
          createdByID: (i % 3) + 1,
          modifiedByID: (i % 3) + 1,
        },
      })
    )
  );

  // Seed Inventory
  const inventories = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.inventory.create({
        data: {
          locationID: locations[i % locations.length].locationID,
          itemID: items[i % items.length].itemID,
          quantity: 100 + i * 10,
          inventoryTypeID:
            inventoryTypes[i % inventoryTypes.length].inventoryTypeID,
          reOrderThreshold: `${i * 10}`,
        },
      })
    )
  );

  // Seed Inventory Adjustment
  await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.inventoryAdjustment.create({
        data: {
          inventoryID: inventories[i % inventories.length].inventoryID,
          adjustmentTypeID:
            adjustmentTypes[i % adjustmentTypes.length].adjustmentTypeID,
          adjustmentReasonID:
            adjustmentReasons[i % adjustmentReasons.length].adjustmentReasonID,
          quantityAdjusted: 5 + i,
          status: "Completed",
          createdByID: (i % 3) + 1,
          modifiedByID: (i % 3) + 1,
        },
      })
    )
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
