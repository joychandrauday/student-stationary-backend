"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashSaleService = void 0;
const flashSale_model_1 = require("./flashSale.model");
const QueryBuilder_1 = __importDefault(require("../Utils/QueryBuilder"));
const product_model_1 = require("../Products/product.model");
const createFlashSale = (flashSellData) => __awaiter(void 0, void 0, void 0, function* () {
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
    const result = yield flashSale_model_1.FlashSale.bulkWrite(operations);
    yield Promise.all(products.map((productId) => __awaiter(void 0, void 0, void 0, function* () {
        const listing = yield product_model_1.productModel.findById(productId);
        if (listing) {
            const newOfferPrice = yield listing.calculateOfferPrice();
            if (newOfferPrice !== null) {
                yield product_model_1.productModel.updateOne({ _id: productId }, { $set: { offerPrice: newOfferPrice, status: "sale" } });
            }
        }
    })));
    return result;
});
const getActiveFlashSalesService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const flashSaleQuery = new QueryBuilder_1.default(flashSale_model_1.FlashSale.find()
        .populate({
        path: 'product',
        select: 'title price offerPrice images price status quantity', // ✅ Include offerPrice
    }), query).paginate();
    const flashSales = yield flashSaleQuery.modelQuery.lean();
    const productsWithOfferPrice = yield Promise.all(flashSales.map((flashSale) => __awaiter(void 0, void 0, void 0, function* () {
        const product = flashSale.product;
        const discountPercentage = flashSale.discountPercentage;
        if (discountPercentage) {
            const discount = (discountPercentage / 100) * product.price;
            product.offerPrice = product.price - discount;
            // ✅ Ensure offerPrice updates in DB
            yield product_model_1.productModel.updateOne({ _id: product._id }, { $set: { offerPrice: product.offerPrice, status: "sale", discount: discountPercentage } });
        }
        return product;
    })));
    const meta = yield flashSaleQuery.countTotal();
    return {
        meta,
        result: productsWithOfferPrice,
    };
});
const removeFromFlashSale = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Remove the product from FlashSale
    const flashSale = yield flashSale_model_1.FlashSale.findOneAndDelete({ product: productId });
    if (!flashSale) {
        throw new Error("Product not found in Flash Sale");
    }
    // Step 2: Reset the offerPrice in the Listing model
    yield product_model_1.productModel.updateOne({ _id: productId }, { $set: { offerPrice: 0, status: "featured", discount: 0 } });
    return { message: "Product removed from Flash Sale and offer price reset" };
});
exports.FlashSaleService = {
    createFlashSale,
    getActiveFlashSalesService,
    removeFromFlashSale
};
