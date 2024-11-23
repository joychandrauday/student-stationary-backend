// 4.service

import { IOrder } from './order.interface'
import { orderModel } from './order.model'

// create a new order
const addOrderToDB = async (order: IOrder) => {
  // Save order to the database
  const result = await orderModel.create(order)
  return result
}

// get all orders
const getOrders = async () => {
  const orders = await orderModel.find()
  return orders
}

const calculateRevenueService = async () => {
  const revenueResult = await orderModel.aggregate([
    {
      $group: {
        _id: null, // Group all documents together
        totalRevenue: { $sum: '$totalPrice' }, // Sum all totalPrice fields
      },
    },
  ])

  // Return totalRevenue or default to 0 if no orders
  return revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0
}

// sending all to controller
export const orderService = {
  addOrderToDB,
  calculateRevenueService,
  getOrders
  // updateOrderInDB,
  // deleteOrderFromDB,
}
