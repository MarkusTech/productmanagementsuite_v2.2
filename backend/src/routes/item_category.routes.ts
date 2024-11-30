import { Router } from "express";
import { CategoryController } from "../controller/item_categoryController";

const router = Router();
const categoryController = new CategoryController();

router.post("/categories", categoryController.createCategory);
router.get("/categories", categoryController.getAllCategories);
router.get("/categories/:categoryID", categoryController.getCategoryById);
router.put("/categories/:categoryID", categoryController.updateCategory);
router.delete("/categories/:categoryID", categoryController.deleteCategory);

export default router;
