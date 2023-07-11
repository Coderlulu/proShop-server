import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
const isAuthenticatedUser = asyncHandler(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        res.status(401);
        throw new Error("Please Login In before this opeartion");
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decodedData.userId);
    next();
});
const isAdmin = asyncHandler(async (req, res, next) => {
    if (req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error("Sorry, you don't have an authorization to access");
    }
});
export { isAuthenticatedUser, isAdmin };
