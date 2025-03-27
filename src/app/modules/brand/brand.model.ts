import mongoose, { Schema, Document } from 'mongoose';
import { IBrand } from './brand.interface';

const brandSchema = new Schema<IBrand & Document>(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        icon: { type: String, required: true }
    },
    { timestamps: true }
);

const Brand = mongoose.model<IBrand & Document>('Brand', brandSchema);

export default Brand;