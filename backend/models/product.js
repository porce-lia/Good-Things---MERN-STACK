import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

    name: {
        type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
    },

    description: {
        type: String,
        trim: true,
        maxlength: 500
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    image: {
        type: String,
        trim: true
    },

    category: {
        type: String
    }

});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
