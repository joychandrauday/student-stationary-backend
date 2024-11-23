"use strict";
// 4.service
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
exports.orderService = void 0;
const order_model_1 = require("./order.model");
// create a new order
const addOrderToDB = (order) => __awaiter(void 0, void 0, void 0, function* () {
    // Save order to the database
    const result = yield order_model_1.orderModel.create(order);
    return result;
});
// get all orders
const getOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.orderModel.find();
    return orders;
});
const calculateRevenueService = () => __awaiter(void 0, void 0, void 0, function* () {
    const revenueResult = yield order_model_1.orderModel.aggregate([
        {
            $group: {
                _id: null, // Group all documents together
                totalRevenue: { $sum: '$totalPrice' }, // Sum all totalPrice fields
            },
        },
    ]);
    // Return totalRevenue or default to 0 if no orders
    return revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
});
// sending all to controller
exports.orderService = {
    addOrderToDB,
    calculateRevenueService,
    getOrders
    // updateOrderInDB,
    // deleteOrderFromDB,
};
