"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
    return result;
});
// Assuming you're using Mongoose for MongoDB
const getAllProducts = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchTerm, name, brand, category, description, inStock, status, minQuantity, maxQuantity, minPrice, maxPrice, minRating, maxRating, page = "1", // Default page 1
        perPage = "10", // Default perPage 10
        sortBy, sortOrder = "asc", // Default ascending order
         } = query;
        // Create a filter object
        const filter = {};
        // Add filters based on query parameters
        if (searchTerm) {
            filter.$or = [
                { name: { $regex: new RegExp(searchTerm, "i") } },
                { description: { $regex: new RegExp(searchTerm, "i") } }
            ];
        }
        if (name)
            filter.name = { $regex: new RegExp(name, "i") };
        if (description)
            filter.description = { $regex: new RegExp(description, "i") };
        if (category)
            filter.category = category;
        if (brand)
            filter.brand = brand;
        if (inStock)
            filter.inStock = inStock === "true";
        if (status) {
            const validStatuses = ["hot", "sale", "featured"];
            if (validStatuses.includes(status)) {
                filter.status = status;
            }
        }
        if (minQuantity)
            filter.quantity = Object.assign(Object.assign({}, filter.quantity), { $gte: parseInt(minQuantity) });
        if (maxQuantity)
            filter.quantity = Object.assign(Object.assign({}, filter.quantity), { $lte: parseInt(maxQuantity) });
        if (minPrice)
            filter.price = Object.assign(Object.assign({}, filter.price), { $gte: parseFloat(minPrice) });
        if (maxPrice)
            filter.price = Object.assign(Object.assign({}, filter.price), { $lte: parseFloat(maxPrice) });
        if (minRating)
            filter.rating = Object.assign(Object.assign({}, filter.rating), { $gte: parseFloat(minRating) });
        if (maxRating)
            filter.rating = Object.assign(Object.assign({}, filter.rating), { $lte: parseFloat(maxRating) });
        // Pagination: Calculate skip and limit values
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(perPage);
        const skip = (pageNumber - 1) * limitNumber;
        // Sorting: Build sort object
        const sort = {};
        if (sortBy) {
            sort[sortBy] = sortOrder === "desc" ? -1 : 1;
        }
        // Fetch total count of products
        const totalCount = yield product_model_1.productModel.countDocuments(filter);
        // Fetch filtered products with pagination and sorting
        const products = yield product_model_1.productModel.find(filter)
            .populate("category")
            .populate("brand")
            .populate("reviews.userId", "-cart -password -paymentMethods")
            .skip(skip)
            .limit(limitNumber)
            .sort(sort)
            .exec();
        // Calculate total pages
        const totalPages = Math.ceil(totalCount / limitNumber);
        // Create meta data
        const meta = {
            totalCount,
            totalPages,
            currentPage: pageNumber,
            perPage: limitNumber,
        };
        return { products, meta };
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error("Error fetching products: " + error.message);
        }
        else {
            throw new Error("Error fetching products: " + String(error));
        }
    }
});
const getTotalCount = (filter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalCount = yield product_model_1.productModel.countDocuments(filter); // Count products based on the filter
        return totalCount;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error("Error fetching products: " + error.message);
        }
        else {
            throw new Error("Error fetching products: " + String(error));
        }
    }
});
const getSingleProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(id);
    const product = yield product_model_1.productModel.findById(id).populate('reviews.userId', 'name avatar').populate("category")
        .populate("brand");
    return product;
});
const updateProductInDB = (id, updatedProduct) => __awaiter(void 0, void 0, void 0, function* () {
    // Update a product in the database by ID
    const result = yield product_model_1.productModel.findByIdAndUpdate(id, updatedProduct, { new: true });
    return result;
});
const deleteProductFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete a product from the database by ID
    const result = yield product_model_1.productModel.findByIdAndDelete(id);
    return result;
});
const getAllProductReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all products and populate 'reviews' along with 'userId' in each review
        const products = yield product_model_1.productModel.find({}).populate({
            path: 'reviews',
            populate: {
                path: 'userId',
                select: 'name email avatar' // Select the fields you want from the user model
            }
        });
        // Flatten the array of reviews from all products
        const allReviews = products.flatMap((product) => product.reviews);
        return allReviews;
    }
    catch (error) {
        throw new Error('Error fetching reviews: ');
    }
});
exports.productService = {
    addProductToDB,
    getAllProducts,
    getSingleProduct,
    updateProductInDB,
    deleteProductFromDB,
    getTotalCount,
    getAllProductReviews
};
