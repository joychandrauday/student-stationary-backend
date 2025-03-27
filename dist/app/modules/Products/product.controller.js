"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productController = void 0;
const product_service_1 = require("./product.service");
const sendResponse_1 = __importDefault(require("../Utils/sendResponse"));
const http_status_codes_1 = require("http-status-codes");
// 1. adding a new product to the database
const addingProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Add product to the database
        const product = req.body;
        const newProduct = yield product_service_1.productService.addProductToDB(product);
        // Send success response
        res.status(201).json({
            message: 'Product added successfully',
            success: true,
            data: newProduct,
        });
    }
    catch (error) {
        // Handle and send error response
        res.status(400).json({
            success: false,
            message: error || 'Failed to add product',
            error,
        });
    }
});
// 2. getting all products from database
const gettingProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_service_1.productService.getAllProducts(req.query);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.StatusCodes.OK,
            success: true,
            message: 'Product retrieved successfully',
            data: products,
        });
    }
    catch (error) {
        // Handle and send error response
        res.status(500).json({
            success: false,
            message: error.message || "Failed to retrieve products",
            error,
        });
    }
});
// 3. getting single product from database
const gettingProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get product from the database by id
        const id = req.params.productId;
        const product = yield product_service_1.productService.getSingleProduct(id);
        console.log(product);
        // Send success response
        res.status(200).json({
            message: 'Product retrieved successfully',
            success: true,
            data: product,
        });
    }
    catch (error) {
        // Handle and send error response
        res.status(404).json({
            success: false,
            message: 'Product not found',
            error,
        });
    }
});
// 4. Update product 
const updatingProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Update product in the database by id
        const id = req.params.productId;
        const updatedProduct = req.body;
        const updatedProductData = yield product_service_1.productService.updateProductInDB(id, updatedProduct);
        // Send success response
        res.status(200).json({
            message: 'Product updated successfully',
            status: true,
            data: updatedProductData,
        });
    }
    catch (error) {
        // Handle and send error response
        res.status(404).json({
            success: false,
            message: 'Product not found',
            error,
        });
    }
});
// 5. Delete product from database
const deletingProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Delete product from the database by id
        const id = req.params.productId;
        yield product_service_1.productService.deleteProductFromDB(id);
        // Send success response
        res.status(200).json({
            message: 'Product deleted successfully',
            status: true,
            data: {}
        });
    }
    catch (error) {
        // Handle and send error response
        res.status(404).json({
            success: false,
            message: 'Product not found',
            error,
        });
    }
});
exports.productController = {
    addingProduct,
    gettingProducts,
    gettingProduct,
    updatingProduct,
    deletingProduct
};
