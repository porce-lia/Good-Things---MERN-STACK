import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.json({ name: "Goodthings Store API", status: "ok", endpoints: ["/api/products", "/api/cart"] });
});
app.get("/api/health", (req, res) => res.json({ status: "ok", database: "connected" }));

// API routes
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {

    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

};

startServer().catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
});
