// 4. Service

import { IProduct } from "./product.interface";
import { productModel } from "./product.model";

const addProductToDB = async (product: IProduct) => {
  // Push new product to the database
  const result = await productModel.create(product);
  console.log(result);
  return result;
};

const getAllProducts = async () => {
    // Retrieve all products from the database
    const products = await productModel.find();
    return products;
} 

const getSingleProduct = async ( id: string ) => {
    // Retrieve a single product from the database by ID
    const product = await productModel.findById(id);
    return product;
}

const updateProductInDB = async (id: string, updatedProduct: IProduct) => {
    // Update a product in the database by ID
    console.log(updatedProduct);
    const result = await productModel.findByIdAndUpdate(id, updatedProduct, { new: true });
    return result;
}

const deleteProductFromDB = async (id: string) => {
    // Delete a product from the database by ID
    const result = await productModel.findByIdAndDelete(id);
    return result;
}

export const productService = {
  addProductToDB,
  getAllProducts,
  getSingleProduct,
  updateProductInDB,
  deleteProductFromDB
};
