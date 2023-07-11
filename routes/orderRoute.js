import express from "express";
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
} from "../controllers/orderController.js";
import { isAdmin, isAuthenticatedUser } from "../middlewares/authMiddleware.js";
const router = express.Router();
router
    .route("/")
    .post(isAuthenticatedUser, addOrderItems)
    .get(isAuthenticatedUser, isAdmin, getOrders);
router.route("/myorders").get(isAuthenticatedUser, getMyOrders);
router.route("/id").get(isAuthenticatedUser, getOrderById);

export default router;
