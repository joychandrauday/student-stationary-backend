// 3. Router
import express from 'express'
import { orderController } from './order.controller'

const router = express.Router()

router.post('/', orderController.addingOrder) // add order to db
router.get('/', orderController.gettingOrders) // getting orders
router.get('/revenue', orderController.calculatingRevenue) // calculating revenue

export const orderRoutes = router
 