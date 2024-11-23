"use strict";
// 3. Controller
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
exports.orderController = void 0;
const order_service_1 = require("./order.service");
const product_model_1 = require("../Products/product.model");
// adding order to database
const addingOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, product: productId, quantity, totalPrice } = req.body;
    try {
        // Check if the product exists and has sufficient stock
        const product = yield product_model_1.productModel.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        if (product.quantity < quantity) {
            res.status(400).json({
                message: 'Insufficient stock available',
                status: false,
            });
        }
        // // Reduce product quantity and update inStock if necessary
        product.quantity -= quantity;
        if (product.quantity === 0) {
            product.inStock = false;
        }
        yield product.save();
        // // Create a new order
        const newOrderDetails = {
            email,
            product: productId,
            quantity,
            totalPrice,
        };
        const newOrder = yield order_service_1.orderService.addOrderToDB(newOrderDetails);
        res.status(201).json({
            message: 'Order created successfully',
            status: true,
            data: newOrder,
        });
    }
    catch (error) {
        // handle and send error response
        res.status(400).json({
            success: false,
            message: error,
        });
    }
});
// getting orders from database
const gettingOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_service_1.orderService.getOrders();
        res.status(200).json({
            message: 'Orders fetched successfully',
            status: true,
            data: orders,
        });
    }
    catch (error) {
        // handle and send error response
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error,
        });
    }
});
// calculating revenue
const calculatingRevenue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const revenue = yield order_service_1.orderService.calculateRevenueService();
        res.status(200).json({
            message: 'Revenue calculated successfully',
            status: true,
            data: { 'totalRevenue': revenue },
        });
    }
    catch (error) {
        // handle and send error response
        res.status(500).json({
            success: false,
            message: 'Error calculating revenue',
            error,
        });
    }
});
// sending to routes
exports.orderController = {
    addingOrder,
    calculatingRevenue,
    gettingOrders
};
