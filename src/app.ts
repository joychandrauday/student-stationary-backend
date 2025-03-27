/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { productRoutes } from './app/modules/Products/product.routes';
import { orderRoutes } from './app/modules/Orders/order.routes';
import { userRoutes } from './app/modules/Users/user.routes';
import { paymentRoutes } from './app/modules/Payments/payment.routes';
import { categoryRouter } from './app/modules/category/category.routes';
import { FlashSaleRoutes } from './app/modules/flashSell/flashSale.routes';
import { brandRoutes } from './app/modules/brand/brand.routes';

const app: Application = express();

// Middleware setup
app.use(express.json()); // To parse incoming JSON requests
app.use(cookieParser()); // To parse cookies from incoming requests

// CORS setup to allow requests from specific domains
const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  "https://student-stationary-frontend.vercel.app", // Production frontend
];

app.use(cors({
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
app.get('/api/v1/', (req: Request, res: Response) => {
  res.send('Hello World from Stationary Backend!!!');
});

// Application routes
app.use('/api/v1/users', userRoutes); // User routes
app.use('/api/v1/products', productRoutes); // Product routes
app.use('/api/v1/orders', orderRoutes); // Order routes
app.use('/api/v1/payment', paymentRoutes); // Payment routes
app.use('/api/v1/category', categoryRouter); // Category routes
app.use('/api/v1/flash-sale', FlashSaleRoutes); // Flash Sale routes
app.use('/api/v1/brand', brandRoutes); // Brand routes

// Global error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error("Global error:", err); // Log the error to the console
  res.status(500).json({ error: 'Internal Server Error' }); // Send generic error message
  next()
});

export default app;
