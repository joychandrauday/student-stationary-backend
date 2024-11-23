// 1. Sending requests to db from client

import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { productRoutes } from './app/modules/Products/product.routes';
import { orderRoutes } from './app/modules/Orders/order.routes';


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
