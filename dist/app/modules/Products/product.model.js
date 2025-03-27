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
exports.productModel = void 0;
/* eslint-disable prefer-const */
const mongoose_1 = require("mongoose");
const flashSale_model_1 = require("../flashSell/flashSale.model");
const mongoose_2 = __importDefault(require("mongoose"));
// Single product schema
const productSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, default: 0 },
    brand: { type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Brand', required: true },
    status: {
        type: String,
        enum: ['sale', 'featured', 'hot'],
        default: 'featured',
    },
    price: { type: Number, required: true },
    discount: { type: Number },
    category: { type: mongoose_2.default.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: { type: [String], required: true },
    featuredImages: { type: String, required: true },
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, required: true, default: true },
    reviews: [
        {
            userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
            description: { type: String, required: true },
            rating: { type: Number, required: true },
            createdAt: { type: Date, default: Date.now },
        },
    ],
    offerPrice: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
// Pre-save hook to update `inStock`
productSchema.pre('save', function (next) {
    this.inStock = this.quantity > 0;
    next();
});
// Pre-update hook to recalculate rating and update `inStock`
productSchema.pre('findOneAndUpdate', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const update = this.getUpdate();
        if (!update)
            return next();
        // Get the current product from the database
        const product = yield this.model.findOne(this.getQuery()).select('quantity reviews');
        if (!product)
            return next();
        // Update `inStock` based on `quantity`
        let newQuantity = product.quantity;
        if (((_a = update.$set) === null || _a === void 0 ? void 0 : _a.quantity) !== undefined) {
            newQuantity = update.$set.quantity;
        }
        if (!update.$set)
            update.$set = {};
        update.$set.inStock = newQuantity > 0;
        // If reviews are updated, recalculate rating
        let reviews = [...product.reviews];
        if ((_b = update.$push) === null || _b === void 0 ? void 0 : _b.reviews) {
            reviews.push(update.$push.reviews);
        }
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            update.$set.rating = parseFloat((totalRating / reviews.length).toFixed(1));
        }
        next();
    });
});
// Mongoose method to calculate offer price based on flash sale
productSchema.methods.calculateOfferPrice = function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Running calculateOfferPrice for listing: ${this._id}`);
        const flashSale = yield flashSale_model_1.FlashSale.findOne({ product: this._id });
        console.log('Found Flash Sale:', flashSale);
        if (flashSale) {
            const discount = (flashSale.discountPercentage / 100) * this.price;
            this.offerPrice = this.price - discount;
            this.discount = flashSale.discountPercentage;
            yield this.save();
            return this.offerPrice;
        }
        return null;
    });
};
exports.productModel = (0, mongoose_1.model)('Product', productSchema);
