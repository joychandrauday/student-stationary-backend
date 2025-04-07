"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const product_routes_1 = require("./app/modules/Products/product.routes");
const order_routes_1 = require("./app/modules/Orders/order.routes");
const user_routes_1 = require("./app/modules/Users/user.routes");
const payment_routes_1 = require("./app/modules/Payments/payment.routes");
const category_routes_1 = require("./app/modules/category/category.routes");
const flashSale_routes_1 = require("./app/modules/flashSell/flashSale.routes");
const brand_routes_1 = require("./app/modules/brand/brand.routes");
const newsletter_route_1 = require("./app/modules/newsletter/newsletter.route");
const app = (0, express_1.default)();
// Middleware setup
app.use(express_1.default.json()); // To parse incoming JSON requests
app.use((0, cookie_parser_1.default)()); // To parse cookies from incoming requests
// CORS setup to allow requests from specific domains
const allowedOrigins = [
    "http://localhost:5173", // Local frontend
    "https://student-stationary-frontend.vercel.app", // Production frontend
];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Check if the origin is in the allowed list
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        // Reject if origin is not allowed
        return callback(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'], // Allowed headers
    credentials: true, // Allow credentials like cookies or authorization headers
}));
// Default route
app.get('/api/v1/', (req, res) => {
    res.send('Hello World from Stationary Backend!!!');
});
// Application routes
app.use('/api/v1/users', user_routes_1.userRoutes); // User routes
app.use('/api/v1/products', product_routes_1.productRoutes); // Product routes
app.use('/api/v1/orders', order_routes_1.orderRoutes); // Order routes
app.use('/api/v1/payment', payment_routes_1.paymentRoutes); // Payment routes
app.use('/api/v1/category', category_routes_1.categoryRouter); // Category routes
app.use('/api/v1/flash-sale', flashSale_routes_1.FlashSaleRoutes); // Flash Sale routes
app.use('/api/v1/brand', brand_routes_1.brandRoutes); // Brand routes
app.use('/api/v1/newsletter', newsletter_route_1.NewsLetterRoutes); // Brand routes
// Global error handler
app.use((err, req, res, next) => {
    console.error("Global error:", err); // Log the error to the console
    res.status(500).json({ error: 'Internal Server Error' }); // Send generic error message
    next();
});
exports.default = app;
