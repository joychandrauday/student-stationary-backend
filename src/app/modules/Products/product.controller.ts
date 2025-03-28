
import { Request, Response } from 'express'
import { productService } from './product.service'
import sendResponse from '../Utils/sendResponse'
import { StatusCodes } from 'http-status-codes';
// 1. adding a new product to the database

const addingProduct = async (req: Request, res: Response) => {
  try {
    // Add product to the database
    const product = req.body
    const newProduct = await productService.addProductToDB(product)
    // Send success response
    res.status(201).json({
      message: 'Product added successfully',
      success: true,
      data: newProduct,
    })
  } catch (error) {
    // Handle and send error response
    res.status(400).json({
      success: false,
      message: error || 'Failed to add product',
      error,
    })
  }
}

// 2. getting all products from database

const gettingProducts = async (req: Request, res: Response) => {
  try {

    const products = await productService.getAllProducts(req.query);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Product retrieved successfully',
      data: products,
    });

  } catch (error) {
    // Handle and send error response
    res.status(500).json({
      success: false,
      message: (error as Error).message || "Failed to retrieve products",
      error,
    });
  }
};




// 3. getting single product from database

const gettingProduct = async (req: Request, res: Response) => {
  try {
    // Get product from the database by id
    const id = req.params.productId
    const product = await productService.getSingleProduct(id)
    console.log(product);

    // Send success response
    res.status(200).json({
      message: 'Product retrieved successfully',
      success: true,
      data: product,
    })
  } catch (error) {
    // Handle and send error response
    res.status(404).json({
      success: false,
      message: 'Product not found',
      error,
    })
  }
}

// 4. Update product 

const updatingProduct = async (req: Request, res: Response) => {
  try {
    // Update product in the database by id
    const id = req.params.productId
    const updatedProduct = req.body
    const updatedProductData = await productService.updateProductInDB(id, updatedProduct)

    // Send success response
    res.status(200).json({
      message: 'Product updated successfully',
      status: true,
      data: updatedProductData,
    })
  } catch (error) {
    // Handle and send error response
    res.status(404).json({
      success: false,
      message: 'Product not found',
      error,
    })
  }
}

// 5. Delete product from database

const deletingProduct = async (req: Request, res: Response) => {
  try {
    // Delete product from the database by id
    const id = req.params.productId
    await productService.deleteProductFromDB(id)

    // Send success response
    res.status(200).json({
      message: 'Product deleted successfully',
      status: true,
      data: {}
    })
  } catch (error) {
    // Handle and send error response
    res.status(404).json({
      success: false,
      message: 'Product not found',
      error,
    })
  }
}


export const productController = {
  addingProduct,
  gettingProducts,
  gettingProduct,
  updatingProduct,
  deletingProduct
}
