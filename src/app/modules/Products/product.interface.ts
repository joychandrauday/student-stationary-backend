// name: { type: String, required: true },
// description: { type: String, required: true },
// rating: { type: Number },
// brand: { type: String, required: true },
// price: { type: Number, required: true },
// category: {
//     type: String,
//       enum: [
//         'Writing',
//         'Office Supplies',
//         'Art Supplies',
//         'Educational',
//         'Technology',
//     ],
//         required: true,
//     },
// images: { type: [String], required: true },
// featuredImages: { type: String, required: true },
// quantity: { type: Number, required: true },

import { Types } from "mongoose";

// inStock: { type: Boolean, required: true, default: true },
export interface IReview {
    userId: string;
    description: string;
    rating: number;
    createdAt: Date;
}
export interface IProduct {
    name: string;
    description: string;
    rating?: number;
    discount?: number;
    brand: Types.ObjectId;
    price: number;
    category: Types.ObjectId;
    images: string[];
    featuredImages: string;
    quantity: number;
    inStock: boolean;
    status: 'sale' | 'featured' | 'hot'
    reviews?: IReview[];
    offerPrice?: number;
    calculateOfferPrice(): Promise<number | null>;
}


