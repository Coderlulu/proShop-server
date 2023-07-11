import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import connectDB from "./db/connectDB.js";
import morgan from "morgan";
import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import productRoute from "./routes/productRoute.js";
import orderRoute from "./routes/orderRoute.js";
dotenv.config();
const app = express();
connectDB();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});
app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
    cors({
        origin: "http://localhost:3000",
        allowCredentials: true,
        allowMethods: ["GET", "POST", "PUT", "DELETE"],
    })
);
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port PORT ${PORT}`);
});
