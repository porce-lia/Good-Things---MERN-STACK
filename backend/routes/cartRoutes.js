import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/product.js";

const router = express.Router();


// 1. GET CART
router.get("/", async (req, res) => {

    try {

        const cart = await Cart.findOne()
            .populate("items.product");

        if (!cart) {
            return res.json({
                items: [],
                totalItems: 0,
                totalPrice: 0
            });
        }

        const totalItems = cart.items.reduce(
            (sum, item) => sum + item.quantity, 0
        );

        const totalPrice = cart.items.reduce(
            (sum, item) =>
                sum + item.product.price * item.quantity, 0
        );

        res.json({
            items: cart.items,
            totalItems,
            totalPrice
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// 2. ADD PRODUCT TO CART
router.post("/add", async (req, res) => {

    try {

        const { productId } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        let cart = await Cart.findOne();

        if (!cart) {
            cart = new Cart({ items: [] });
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({
                product: productId,
                quantity: 1
            });
        }

        await cart.save();

        res.status(200).json({
            message: "Product added to cart",
            cart
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});


// 3. UPDATE PRODUCT QUANTITY
router.put("/:productId", async (req, res) => {

    try {

        const { quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Quantity must be a positive integer"
            });
        }

        const cart = await Cart.findOne();

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            item => item.product.toString() === req.params.productId
        );

        if (!item) {
            return res.status(404).json({
                message: "Item not found in cart"
            });
        }

        item.quantity = quantity;

        await cart.save();

        res.json({
            message: "Quantity updated successfully"
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});


// 4. REMOVE SINGLE PRODUCT
router.delete("/:productId", async (req, res) => {

    try {

        const cart = await Cart.findOne();

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== req.params.productId
        );

        await cart.save();

        res.json({
            message: "Product removed from cart"
        });

    } catch (error) {

        res.status(400).json({
            message: error.message
        });

    }

});


// 5. CLEAR ENTIRE CART
router.delete("/", async (req, res) => {

    try {

        const cart = await Cart.findOne();

        if (cart) {
            cart.items = [];
            await cart.save();
        }

        res.json({
            message: "Cart cleared successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

export default router;
