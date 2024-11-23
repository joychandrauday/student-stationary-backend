"use strict";
// 4. Service
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const product_model_1 = require("./product.model");
const addProductToDB = (product) => __awaiter(void 0, void 0, void 0, function* () {
    // Push new product to the database
    const result = yield product_model_1.productModel.create(product);
    console.log(result);
    return result;
});
const getAllProducts = () => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve all products from the database
    const products = yield product_model_1.productModel.find();
    return products;
});
const getSingleProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve a single product from the database by ID
    const product = yield product_model_1.productModel.findById(id);
    return product;
});
const updateProductInDB = (id, updatedProduct) => __awaiter(void 0, void 0, void 0, function* () {
    // Update a product in the database by ID
    console.log(updatedProduct);
    const result = yield product_model_1.productModel.findByIdAndUpdate(id, updatedProduct, { new: true });
    return result;
});
const deleteProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete a product from the database by ID
    const result = yield product_model_1.productModel.findByIdAndDelete(id);
    return result;
});
exports.productService = {
    addProductToDB,
    getAllProducts,
    getSingleProduct,
    updateProductInDB,
    deleteProductFromDB
};
