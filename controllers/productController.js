import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import cloudinary from "cloudinary";
const createProduct = asyncHandler(async (req, res) => {
    const imagesLink = [];
    for (let i = 0; i < req.body.images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(req.body.images[i], {
            folder: "products",
        });
        console.log(result);
        imagesLink.push({
            public_id: result.public_id,
            url: result.secure_url,
        });
    }
    console.log(imagesLink);
    req.body.images = imagesLink;
    const {
        name,
        price,
        description,
        brand,
        category,
        countInStock,
        rating,
        numOfReviews,
    } = req.body;
    const product = await Product.create({
        user: req.user._id,
        name,
        price,
        description,
        brand,
        category,
        countInStock,
        rating,
        numOfReviews,
        image: imagesLink,
    });
    res.status(201).json(product);
});
const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, images, brand, category, countInStock } =
        req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(401);
        throw new Error("Sorry, the product is not found");
    } else {
        product.name = name || product.name;
        product.price = price || product.price;
        product.description = description || product.description;
        product.image = image || product.image;
        product.category = category || product.category;
        product.countInStock = countInStock || product.countInStock;
    }
    const updatedProduct = await product.save();
    res.json(updatedProduct);
});
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
              name: {
                  $regex: req.query.keyword,
                  $options: "i",
              },
          }
        : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

const deleteProduct = asyncHandler(async (req, res) => {
    if (await Product.findById(req.params.id)) {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product removed" });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});
const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
        const alreadyReviewed = product.reviews.find(
            r => r.user.toString() === req.user._id.toString()
        );
        if (alreadyReviewed) {
            res.status(400);
            throw new Error("Product already reviewed");
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;
        await product.save();
        res.status(201).json({ message: "Review added" });
    } else {
        res.status(404);
        throw new Error("Product Not Found");
    }
});
const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().sort({ rating: -1 }).limit(3);
    res.json(products);
});

export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview,
    getTopProducts,
};
