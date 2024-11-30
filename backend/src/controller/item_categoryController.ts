import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class CategoryController {
  // Create a new category
  async createCategory(req: Request, res: Response): Promise<void> {
    const { categoryCode, categoryName, description, status } = req.body;

    try {
      const newCategory = await prisma.categories.create({
        data: {
          categoryCode,
          categoryName,
          description,
          status,
        },
      });

      logger.info(`Category created: ID ${newCategory.categoryID}`);

      res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: newCategory,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`Error creating category: ${error.message}`);
        throw new CustomError("Error creating category", 500);
      }
      logger.error("An unexpected error occurred while creating category");
      throw new CustomError("An unexpected error occurred", 500);
    }
  }

  // Get all categories
  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await prisma.categories.findMany();
      logger.info("Fetched all categories");

      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      logger.error(`Error fetching categories: ${(error as Error).message}`);
      throw new CustomError("Error fetching categories", 500);
    }
  }

  // Get category by ID
  async getCategoryById(req: Request, res: Response): Promise<void> {
    const { categoryID } = req.params;

    try {
      const category = await prisma.categories.findUnique({
        where: { categoryID: parseInt(categoryID) },
      });

      if (!category) {
        logger.warn(`Category with ID ${categoryID} not found`);
        throw new CustomError("Category not found", 404);
      } else {
        logger.info(`Fetched category with ID ${categoryID}`);
        res.status(200).json({
          success: true,
          data: category,
        });
      }
    } catch (error) {
      logger.error(`Error fetching category: ${(error as Error).message}`);
      throw new CustomError("Error fetching category", 500);
    }
  }

  // Update category by ID
  async updateCategory(req: Request, res: Response): Promise<void> {
    const { categoryID } = req.params;
    const { categoryCode, categoryName, description, status } = req.body;

    try {
      // Find the existing category to check if it exists
      const existingCategory = await prisma.categories.findUnique({
        where: { categoryID: parseInt(categoryID) },
      });

      if (!existingCategory) {
        logger.warn(`Category with ID ${categoryID} not found`);
        res.status(404).json({
          success: false,
          message: `Category with ID ${categoryID} not found`,
        });
        return;
      }

      // Prepare data for update, only update fields that are present in the request body
      const updatedData: any = {};
      if (categoryCode !== undefined) updatedData.categoryCode = categoryCode;
      if (categoryName !== undefined) updatedData.categoryName = categoryName;
      if (description !== undefined) updatedData.description = description;
      if (status !== undefined) updatedData.status = status;

      const updatedCategory = await prisma.categories.update({
        where: { categoryID: parseInt(categoryID) },
        data: updatedData,
      });

      logger.info(`Category with ID ${categoryID} updated`);

      res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: updatedCategory,
      });
    } catch (error) {
      logger.error(`Error updating category: ${(error as Error).message}`);
      res.status(500).json({
        success: false,
        message: "Error updating category",
      });
    }
  }

  // Delete category
  async deleteCategory(req: Request, res: Response): Promise<void> {
    const { categoryID } = req.params;

    try {
      await prisma.categories.delete({
        where: { categoryID: parseInt(categoryID) },
      });

      logger.info(`Category with ID ${categoryID} deleted`);

      res.status(200).json({
        success: true,
        message: "Category deleted successfully",
      });
    } catch (error) {
      logger.error(`Error deleting category: ${(error as Error).message}`);
      throw new CustomError("Error deleting category", 500);
    }
  }
}
