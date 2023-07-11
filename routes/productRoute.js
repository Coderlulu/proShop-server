import express from "express";
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js";
const router = express.Router();
import { isAuthenticatedUser, isAdmin } from "../middlewares/authMiddleware.js";

router
  .route("/")
  .get(getProducts)
  .post(isAuthenticatedUser, isAdmin, createProduct);
router.route("/top").get(getTopProducts);
router
  .route("/:id")
  .get(getProductById)
  .delete(isAuthenticatedUser, isAdmin, deleteProduct)
  .put(isAuthenticatedUser, isAdmin, updateProduct);
router.route("/:id/reviews").post(isAuthenticatedUser, createProductReview);
export default router;
