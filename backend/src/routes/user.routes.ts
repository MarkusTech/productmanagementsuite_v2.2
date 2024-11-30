import { Router } from "express";
import { UserController } from "../controller/userController";
import upload from "../config/multerConfig";

const router = Router();
const userController = new UserController();

router.post("/users", upload, userController.createUser.bind(userController));

router.get("/users", userController.getAllUsers);
router.get("/users/:userID", userController.getUserById);
router.put("/users/:userID", userController.updateUser);
router.delete("/users/:userID", userController.deleteUser);
router.get("/user-role", userController.getAllUserRoles);

export default router;
