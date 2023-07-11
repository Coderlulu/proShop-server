import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
const addOrderItems = asyncHandler(async (req, res, next) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;
    if (orderItems && orderItems.length === 0) {
        return res.status(400).json("No new item");
    } else {
        const order = await Order.create({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });
        return res.status(201).json(order);
    }
});
const getOrderById = () => {};
const updateOrderToDelivered = () => {};
const updateOrderToPaid = () => {};
const getMyOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    return res.json(orders).status(200);
});
const getOrders = asyncHandler(async (req, res, next) => {
    const orders = await Order.find();
    return res.json(orders).status(200);
});
export {
    addOrderItems,
    getOrderById,
    updateOrderToDelivered,
    updateOrderToPaid,
    getMyOrders,
    getOrders,
};
