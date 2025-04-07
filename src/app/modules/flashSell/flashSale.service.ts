/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICreateFlashSaleInput } from "./flashSale.interface";
import { FlashSale } from "./flashSale.model";
import QueryBuilder from "../Utils/QueryBuilder";
import { productModel } from "../Products/product.model";

const createFlashSale = async (flashSellData: ICreateFlashSaleInput) => {
  const { products, discountPercentage } = flashSellData;
  const createdBy = '67956248af1cf3b9a4bc8e91';
  const operations = products.map((product) => ({
    updateOne: {
      filter: { product },
      update: {
        $setOnInsert: {
          product,
          discountPercentage,
          createdBy,
        },
      },
      upsert: true,
    },
  }));

  const result = await FlashSale.bulkWrite(operations);

  await Promise.all(
    products.map(async (productId) => {
      const listing = await productModel.findById(productId);
      if (listing) {
        const newOfferPrice = await listing.calculateOfferPrice();
        if (newOfferPrice !== null) {
          await productModel.updateOne({ _id: productId }, { $set: { offerPrice: newOfferPrice, status: "sale" } });
        }
      }
    })
  );

  return result;
};

const getActiveFlashSalesService = async (query: Record<string, unknown>) => {
  const flashSaleQuery = new QueryBuilder(
    FlashSale.find()
      .populate({
        path: 'product',
        select: 'title price offerPrice images price status quantity', // ✅ Include offerPrice
      }),
    query
  ).paginate();

  const flashSales = await flashSaleQuery.modelQuery.lean();

  const productsWithOfferPrice = await Promise.all(
    flashSales.map(async (flashSale: any) => {
      const product = flashSale.product;
      const discountPercentage = flashSale.discountPercentage;

      if (discountPercentage) {
        const discount = (discountPercentage / 100) * product.price;
        product.offerPrice = product.price - discount;

        // ✅ Ensure offerPrice updates in DB
        await productModel.updateOne({ _id: product._id }, { $set: { offerPrice: product.offerPrice, status: "sale", discount: discountPercentage } });
      }

      return product;
    })
  );

  const meta = await flashSaleQuery.countTotal();

  return {
    meta,
    result: productsWithOfferPrice,
  };
};
const removeFromFlashSale = async (productId: string) => {
  // Step 1: Remove the product from FlashSale
  const flashSale = await FlashSale.findOneAndDelete({ product: productId });

  if (!flashSale) {
    throw new Error("Product not found in Flash Sale");
  }

  // Step 2: Reset the offerPrice in the Listing model
  await productModel.updateOne(
    { _id: productId },
    { $set: { offerPrice: 0, status: "featured", discount: 0 } }
  );

  return { message: "Product removed from Flash Sale and offer price reset" };
};


export const FlashSaleService = {
  createFlashSale,
  getActiveFlashSalesService,
  removeFromFlashSale
};
