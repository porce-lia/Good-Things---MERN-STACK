import express from "express";
import Product from "../models/product.js";
import Cart from "../models/Cart.js";

const router = express.Router();


// 1. GET ALL PRODUCTS
router.get("/", async (req, res) => {

    try {
        const products = await Product.find();

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching products"
        });
    }

});


// 2. GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {

    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(400).json({
            message: "Invalid product ID"
        });
    }

});


// 3. ADD NEW PRODUCT
router.post("/", async (req, res) => {

    try {

        const { name, description, price, image, category } = req.body;

        const product = await Product.create({
            name,
            description,
            price,
            image,
            category
        });

        res.status(201).json({
            message: "Product added successfully",
            product
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});


// 4. UPDATE PRODUCT
router.put("/:id", async (req, res) => {

    try {

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});


// 5. DELETE PRODUCT
router.delete("/:id", async (req, res) => {

    try {

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Remove this product from the cart too
        await Cart.updateMany(
            {},
            {
                $pull: {
                    items: { product: product._id }
                }
            }
        );

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});

export default router;
