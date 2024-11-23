// 3. Controller

import { Request, Response } from 'express'
import { orderService } from './order.service'
import { productModel } from '../Products/product.model'

// adding order to database
const addingOrder = async (req: Request, res: Response) => {
  const { email, product: productId, quantity, totalPrice } = req.body
  try {
    // Check if the product exists and has sufficient stock
    const product = await productModel.findById(productId)

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.quantity < quantity) {
      res.status(400).json({
        message: 'Insufficient stock available',
        status: false,
      })
    }

    // // Reduce product quantity and update inStock if necessary
    product.quantity -= quantity
    if (product.quantity === 0) {
      product.inStock = false
    }
    await product.save()

    // // Create a new order
    const newOrderDetails = {
      email,
      product: productId,
      quantity,
      totalPrice,
    }
    const newOrder = await orderService.addOrderToDB(newOrderDetails)

    res.status(201).json({
      message: 'Order created successfully',
      status: true,
      data: newOrder,
    })
    
  } catch (error) {
    // handle and send error response
    res.status(400).json({
      success: false,
      message: error,
    })
    
  }
}
// getting orders from database
const gettingOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getOrders()
    res.status(200).json({
      message: 'Orders fetched successfully',
      status: true,
      data: orders,
    })
  } catch (error) {
    // handle and send error response
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error,
    })
  }
}
// calculating revenue
const calculatingRevenue = async (req: Request, res: Response) => {
  try {
    const revenue = await orderService.calculateRevenueService()
    res.status(200).json({
      message: 'Revenue calculated successfully',
      status: true,
      data: { 'totalRevenue': revenue },
    })
  } catch (error) {
    // handle and send error response
    res.status(500).json({
      success: false,
      message: 'Error calculating revenue',
      error,
    })
  }
}

// sending to routes
export const orderController = {
  addingOrder,
  calculatingRevenue,
  gettingOrders
}
