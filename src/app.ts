// 1. Sending requests to db from client

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import { productRoutes } from './app/modules/Products/product.routes';
import { orderRoutes } from './app/modules/Orders/order.routes';
import { userRoutes } from './app/modules/Users/user.routes';
import { paymentRoutes } from './app/modules/Payments/payment.routes';


const app: Application = express();

// Middleware
// app.use(express.json());
// const allowedOrigins = [
//   'https://student-stationary-frontend.vercel.app',
//   'http://localhost:5173',
//   'http://localhost:5174',
//   'http://localhost:5175',
// ];

// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }
//       return callback(new Error('Not allowed by CORS'));
//     },
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
//     credentials: true,
//   })
// );
// app.options('*', cors())
// app.use(bodyParser.json());
//parsers
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: ["http://localhost:5173", "https://student-stationary-frontend.vercel.app"], credentials: true }));


// Default route
app.get('/api/v1/', (req: Request, res: Response) => {
  res.send('Hello World frpm stationary backend!!!');
});

//appllication routes
app.use('/api/v1/users', userRoutes) // product routes
app.use('/api/v1/products', productRoutes) // product routes
app.use('/api/v1/orders', orderRoutes) // order routes
app.use('/api/v1/payment', paymentRoutes) // order routes




export default app;
