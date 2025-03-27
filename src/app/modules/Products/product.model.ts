/* eslint-disable prefer-const */
import { model, Schema, UpdateQuery } from 'mongoose';
import { IProduct } from './product.interface';
import { FlashSale } from '../flashSell/flashSale.model';
import mongoose from 'mongoose';

// Single product schema
const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, default: 0 },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true },
    status: {
      type: String,
      enum: ['sale', 'featured', 'hot'],
      default: 'featured',
    },
    price: { type: Number, required: true },
    discount: { type: Number },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    images: { type: [String], required: true },
    featuredImages: { type: String, required: true },
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, required: true, default: true },
    reviews: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        description: { type: String, required: true },
        rating: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    offerPrice: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Pre-save hook to update `inStock`
productSchema.pre('save', function (next) {
  this.inStock = this.quantity > 0;
  next();
});

// Pre-update hook to recalculate rating and update `inStock`
productSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate() as UpdateQuery<IProduct>;

  if (!update) return next();

  // Get the current product from the database
  const product = await this.model.findOne(this.getQuery()).select('quantity reviews');

  if (!product) return next();

  // Update `inStock` based on `quantity`
  let newQuantity = product.quantity;
  if (update.$set?.quantity !== undefined) {
    newQuantity = update.$set.quantity;
  }

  if (!update.$set) update.$set = {};
  update.$set.inStock = newQuantity > 0;

  // If reviews are updated, recalculate rating
  let reviews = [...product.reviews];
  if (update.$push?.reviews) {
    reviews.push(update.$push.reviews);
  }

  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    update.$set.rating = parseFloat((totalRating / reviews.length).toFixed(1));
  }

  next();
});

// Mongoose method to calculate offer price based on flash sale
productSchema.methods.calculateOfferPrice = async function () {
  console.log(`Running calculateOfferPrice for listing: ${this._id}`);
  const flashSale = await FlashSale.findOne({ product: this._id });
  console.log('Found Flash Sale:', flashSale);

  if (flashSale) {
    const discount = (flashSale.discountPercentage / 100) * this.price;
    this.offerPrice = this.price - discount;
    this.discount = flashSale.discountPercentage;
    await this.save();
    return this.offerPrice;
  }

  return null;
};

export const productModel = model<IProduct>('Product', productSchema);
