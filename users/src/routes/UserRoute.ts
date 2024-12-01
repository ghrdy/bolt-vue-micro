import express from "express";
import userController from "../controllers/UserController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/login", userController.login);
router.post("/register", userController.register);
router.post("/logout", userController.logout);
router.post("/refresh-token", userController.refreshToken);
router.post("/delete", authMiddleware, userController.del);

export default router;