import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class ItemController {
  // Create a new item
  async createItem(req: Request, res: Response): Promise<void> {
    const {
      itemCode,
      categoryID,
      barcode,
      itemName,
      description,
      grams,
      uom,
      price,
      cost,
      createdByID,
      modifiedByID,
    } = req.body;

    // Optional image URL
    let image_url: string | null = req.file ? req.file.path : null;

    try {
      // Create new item
      const newItem = await prisma.items.create({
        data: {
          itemCode,
          categoryID: parseInt(categoryID, 10),
          barcode,
          itemName,
          description,
          grams: parseFloat(grams),
          uom,
          price: parseFloat(price),
          cost: parseFloat(cost),
          image_url,
          createdByID: parseInt(createdByID, 10),
          modifiedByID: parseInt(modifiedByID, 10),
        },
      });

      logger.info(`Item created: ID ${newItem.itemID}, Name ${itemName}`);

      res.status(201).json({
        success: true,
        message: "Item created successfully",
        data: newItem,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error creating item: ${error.message}`);
        res
          .status(500)
          .json({ success: false, message: "Error creating item" });
      } else {
        logger.error("An unexpected error occurred while creating item");
        res
          .status(500)
          .json({ success: false, message: "An unexpected error occurred" });
      }
    }
  }

  async getAllItems(req: Request, res: Response): Promise<void> {
    try {
      const items = await prisma.items.findMany({
        include: {
          category: {
            select: {
              categoryName: true,
            },
          },
        },
      });
      logger.info("Fetched all items");

      // Map items to include categoryName
      const itemsWithCategoryName = items.map((item) => ({
        ...item,
        categoryName: item.category?.categoryName || null,
      }));

      res.status(200).json({
        success: true,
        data: itemsWithCategoryName,
      });
    } catch (error) {
      logger.error(`Error fetching items: ${(error as Error).message}`);
      throw new CustomError("Error fetching items", 500);
    }
  }

  // Get item by ID
  async getItemById(req: Request, res: Response): Promise<void> {
    const { itemID } = req.params;

    try {
      const item = await prisma.items.findUnique({
        where: { itemID: parseInt(itemID) },
      });

      if (!item) {
        logger.warn(`Item with ID ${itemID} not found`);
        res.status(404).json({
          success: false,
          message: "Item not found",
        });
      } else {
        logger.info(`Fetched item with ID ${itemID}`);
        res.status(200).json({
          success: true,
          data: item,
        });
      }
    } catch (error) {
      logger.error(`Error fetching item: ${(error as Error).message}`);
      throw new CustomError("Error fetching item", 500);
    }
  }

  // Update item
  async updateItem(req: Request, res: Response): Promise<void> {
    const { itemID } = req.params;
    const {
      itemCode,
      categoryID,
      barcode,
      itemName,
      description,
      grams,
      uom,
      price,
      cost,
      image_url,
      modifiedByID,
      status,
    } = req.body;

    try {
      const updatedItem = await prisma.items.update({
        where: { itemID: parseInt(itemID) },
        data: {
          itemCode,
          categoryID,
          barcode,
          itemName,
          description,
          grams,
          uom,
          price,
          cost,
          image_url,
          modifiedByID,
          status,
        },
      });

      logger.info(`Item with ID ${itemID} updated`);

      res.status(200).json({
        success: true,
        message: "Item updated successfully",
        data: updatedItem,
      });
    } catch (error) {
      logger.error(`Error updating item: ${(error as Error).message}`);
      throw new CustomError("Error updating item", 500);
    }
  }

  // Delete item
  async deleteItem(req: Request, res: Response): Promise<void> {
    const { itemID } = req.params;

    try {
      await prisma.items.delete({
        where: { itemID: parseInt(itemID) },
      });

      logger.info(`Item with ID ${itemID} deleted`);

      res.status(200).json({
        success: true,
        message: "Item deleted successfully",
      });
    } catch (error) {
      logger.error(`Error deleting item: ${(error as Error).message}`);
      throw new CustomError("Error deleting item", 500);
    }
  }

  // Save Item with Up to 5 images and also save to item to inventory
  async createItemAndSaveToInventory(
    req: Request,
    res: Response
  ): Promise<void> {
    const {
      itemCode,
      categoryID,
      barcode,
      itemName,
      description,
      grams,
      uom,
      price,
      cost,
      createdByID,
      modifiedByID,
    } = req.body;

    // Handle image files (up to 5)
    const imageUrls: string[] = [];
    let firstImageUrl: string | null = null;

    if (req.files && Array.isArray(req.files)) {
      req.files.forEach((file: any, index: number) => {
        imageUrls.push(file.path);
        if (index === 0) {
          firstImageUrl = file.path;
        }
      });
    }

    try {
      // Step 1: Create the item
      const newItem = await prisma.items.create({
        data: {
          itemCode,
          categoryID: parseInt(categoryID, 10),
          barcode,
          itemName,
          description,
          grams: parseFloat(grams),
          uom,
          price: parseFloat(price),
          cost: parseFloat(cost),
          createdByID: parseInt(createdByID, 10),
          modifiedByID: parseInt(modifiedByID, 10),
          image_url: firstImageUrl,
        },
      });

      logger.info(`Item created: ID ${newItem.itemID}, Name ${itemName}`);

      if (imageUrls.length > 0) {
        const imageRecords = imageUrls.map((url) => ({
          itemID: newItem.itemID,
          url,
        }));

        await prisma.itemImage.createMany({
          data: imageRecords,
          skipDuplicates: true,
        });
      }

      // Step 3: Create inventory records
      const locations = await prisma.locations.findMany({
        where: { status: true },
      });

      const inventoryTypes = await prisma.inventoryType.findMany({
        where: { status: true },
      });

      const inventoryRecords = [];

      for (const location of locations) {
        for (const inventoryType of inventoryTypes) {
          inventoryRecords.push({
            locationID: location.locationID,
            itemID: newItem.itemID,
            quantity: 0,
            inventoryTypeID: inventoryType.inventoryTypeID,
            reOrderThreshold: "0",
          });
        }
      }

      await prisma.inventory.createMany({
        data: inventoryRecords,
      });

      res.status(201).json({
        success: true,
        message: "Item and inventory records created successfully",
        data: newItem,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error creating item: ${error.message}`);
        res
          .status(500)
          .json({ success: false, message: "Error creating item" });
      } else {
        logger.error("An unexpected error occurred while creating item");
        res
          .status(500)
          .json({ success: false, message: "An unexpected error occurred" });
      }
    }
  }

  // Get Item with Images
  async getItemAndImageById(req: Request, res: Response): Promise<void> {
    const { itemID } = req.params;

    try {
      const parsedItemID = parseInt(itemID, 10);
      if (isNaN(parsedItemID)) {
        logger.warn(`Invalid item ID: ${itemID}`);
        res.status(400).json({
          success: false,
          message: "Invalid item ID",
        });
        return;
      }

      const item = await prisma.items.findUnique({
        where: { itemID: parsedItemID },
        include: {
          itemImages: true,
        },
      });

      if (!item) {
        logger.warn(`Item with ID ${itemID} not found`);
        res.status(404).json({
          success: false,
          message: "Item not found",
        });
        return;
      }

      logger.info(`Fetched item with ID ${itemID}`);
      res.status(200).json({
        success: true,
        data: {
          ...item,
          images: item.itemImages,
        },
      });
    } catch (error) {
      logger.error(`Error fetching item: ${(error as Error).message}`);
      res.status(500).json({
        success: false,
        message: "Error fetching item",
      });
    }
  }
}
