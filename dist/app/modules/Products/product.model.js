"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productModel = void 0;
// 5. Model
const mongoose_1 = require("mongoose");
// single product schema
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
        type: String,
        enum: [
            'Writing',
            'Office Supplies',
            'Art Supplies',
            'Educational',
            'Technology',
        ],
        required: true,
    },
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, required: true, default: true },
}, { timestamps: true });
exports.productModel = (0, mongoose_1.model)('Product', productSchema);
