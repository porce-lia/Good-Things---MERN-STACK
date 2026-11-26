import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import Product from "./models/product.js";

dotenv.config();

const products = [

    {
        name: "Classic Sneakers",
        description: "Comfortable everyday sneakers",
        price: 1499,
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
    },

    {
        name: "Wrist Watch",
        description: "Stylish everyday wrist watch",
        price: 2199,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
    },

    {
        name: "Backpack",
        description: "Perfect for college and travel",
        price: 999,
        category: "Bags",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    },

    {
        name: "Headphones",
        description: "Wireless music headphones",
        price: 1799,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    },

    {
        name: "Coffee Mug",
        description: "Simple ceramic coffee mug",
        price: 349,
        category: "Home",
        image: "https://images.unsplash.com/photo-1514228742587-6b1558f34514?w=500"
    },

    {
        name: "Sunglasses",
        description: "Classic stylish sunglasses",
        price: 799,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500"
    },
    {
        name: "Soft Glow Table Lamp",
        description: "Warm light for slow evenings",
        price: 1899,
        category: "Home",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=700"
    },
    {
        name: "Everyday Lounge Chair",
        description: "A comfortable corner of your own",
        price: 5499,
        category: "Home",
        image: "https://images.unsplash.com/photo-1598300056393-4aac492f4344?w=700"
    },
    {
        name: "Pocket Film Camera",
        description: "Keep the moments worth keeping",
        price: 3299,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700"
    },
    {
        name: "Portable Speaker",
        description: "Good sound, wherever you go",
        price: 2499,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=700"
    },
    {
        name: "Market Day Tote",
        description: "An easy carryall for every plan",
        price: 599,
        category: "Bags",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=700"
    },
    {
        name: "Leather Card Holder",
        description: "A neat home for the essentials",
        price: 899,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=700"
    },
    {
        name: "Insulated Bottle",
        description: "A little refreshment on the move",
        price: 699,
        category: "Everyday",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=700"
    },
    {
        name: "Linen Cover Notebook",
        description: "Space for the next good idea",
        price: 449,
        category: "Everyday",
        image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=700"
    },
    {
        name: "Sculpted Ceramic Vase",
        description: "A quiet centrepiece for any room",
        price: 1199,
        category: "Home",
        image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=700"
    },
    {
        name: "Canvas Weekend Shoes",
        description: "Lightweight comfort for laid-back days",
        price: 1299,
        category: "Footwear",
        image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=700"
    }

];

const seedData = async () => {

    try {

        await connectDB();

        const results = await Product.bulkWrite(products.map((product) => ({
            updateOne: { filter: { name: product.name }, update: { $set: product }, upsert: true }
        })));
        console.log(`Sample catalog synced: ${results.upsertedCount} added, ${results.modifiedCount} updated. Existing products and cart were preserved.`);

    } catch (error) {

        console.error("Seeding failed:", error.message);
        process.exitCode = 1;

    } finally {

        await mongoose.connection.close();

    }

};

seedData();
