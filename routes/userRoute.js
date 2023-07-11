import express from "express";
import {
  createUser,
  login,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
} from "../controllers/userController.js";
import { isAdmin, isAuthenticatedUser } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.route("/create").post(createUser);
router.route("/login").post(login);
router
  .route("/profile")
  .get(isAuthenticatedUser, getUserProfile)
  .put(isAuthenticatedUser, updateUserProfile);
router.route("/admin").get(isAuthenticatedUser, isAdmin, getAllUsers);
router
  .route("/admin/:id")
  .get(isAuthenticatedUser, isAdmin, getUser)
  .put(isAuthenticatedUser, isAdmin, updateUser)
  .delete(isAuthenticatedUser, isAdmin, deleteUser);
export default router;
