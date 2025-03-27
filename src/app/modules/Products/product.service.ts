/* eslint-disable @typescript-eslint/no-explicit-any */
// 4. Service

import { RootFilterQuery } from "mongoose";
import { IProduct } from "./product.interface";
import { productModel } from "./product.model";

const addProductToDB = async (product: IProduct) => {
  // Push new product to the database
  const result = await productModel.create(product);
  return result;
};

// Assuming you're using Mongoose for MongoDB
const getAllProducts = async (query: Record<string, unknown>) => {
  try {
    const {
      name,
      brand,
      category,
      description,
      inStock,
      status,
      minQuantity,
      maxQuantity,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
      page = "1", // Default page 1
      perPage = "10", // Default perPage 10
      sortBy,
      sortOrder = "asc", // Default ascending order
    } = query;

    // Create a filter object
    const filter: any = {};

    // Add filters based on query parameters
    if (name) filter.name = { $regex: new RegExp(name as string, "i") };
    if (description) filter.description = { $regex: new RegExp(description as string, "i") };
    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (inStock) filter.inStock = inStock === "true";
    if (status) {
      const validStatuses = ["hot", "sale", "featured"];
      if (validStatuses.includes(status as string)) {
        filter.status = status;
      }
    }
    if (minQuantity) filter.quantity = { ...filter.quantity, $gte: parseInt(minQuantity as string) };
    if (maxQuantity) filter.quantity = { ...filter.quantity, $lte: parseInt(maxQuantity as string) };
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice as string) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice as string) };
    if (minRating) filter.rating = { ...filter.rating, $gte: parseFloat(minRating as string) };
    if (maxRating) filter.rating = { ...filter.rating, $lte: parseFloat(maxRating as string) };

    // Pagination: Calculate skip and limit values
    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(perPage as string);
    const skip = (pageNumber - 1) * limitNumber;

    // Sorting: Build sort object
    const sort: any = {};
    if (sortBy) {
      sort[sortBy as string] = sortOrder === "desc" ? -1 : 1;
    }

    // Fetch total count of products
    const totalCount = await productModel.countDocuments(filter);

    // Fetch filtered products with pagination and sorting
    const products = await productModel.find(filter)
      .populate("category")
      .populate("brand")
      .populate("reviews.userId", "-cart -password -paymentMethods")
      .skip(skip)
      .limit(limitNumber)
      .sort(sort)
      .exec();

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limitNumber);

    // Create meta data
    const meta = {
      totalCount,
      totalPages,
      currentPage: pageNumber,
      perPage: limitNumber,
    };

    return { products, meta };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error fetching products: " + error.message);
    } else {
      throw new Error("Error fetching products: " + String(error));
    }
  }
};




const getTotalCount = async (filter: RootFilterQuery<IProduct> | undefined) => {
  try {
    const totalCount = await productModel.countDocuments(filter); // Count products based on the filter
    return totalCount;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error("Error fetching products: " + error.message);
    } else {
      throw new Error("Error fetching products: " + String(error));
    }
  }
};
const getSingleProduct = async (id: string) => {
  console.log(id);
  const product = await productModel.findById(id).populate('reviews.userId', 'name avatar')
  return product;
}

const updateProductInDB = async (id: string, updatedProduct: IProduct) => {
  // Update a product in the database by ID
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
  deleteProductFromDB,
  getTotalCount
};
