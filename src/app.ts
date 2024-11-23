// 1. Sending requests to db from client

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { productRoutes } from './modules/Products/product.routes';
import { orderRoutes } from './modules/Orders/order.routes';
import bodyParser from 'body-parser';


const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Default route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World frpm stationary backend!!!');
});

//appllication routes
app.use('/api/products', productRoutes) // product routes
app.use('/api/orders', orderRoutes) // order routes




export default app;
