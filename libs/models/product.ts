import { model, Schema } from 'mongoose';

export interface IProduct {
  name: string;
  price: number;
  description: string;
  previewUrl: string;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    previewUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Products', productSchema);
