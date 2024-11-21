import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { productRoutes } from './modules/Products/product.routes';


const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());

// Default route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World frpm stationary backend!!!');
});

//appllication routes
app.use('/api/products', productRoutes)

export default app;
