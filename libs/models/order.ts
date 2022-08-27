import { model, Schema } from 'mongoose';

export interface IOrder {
  products: { product_id: string }[];
  total: number;
}

const orderSchema = new Schema<IOrder>(
  {
    products: [{ product_id: String }],
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Order = model<IOrder>('Orders', orderSchema);

export const createOrder = (products: any[]) => {
  let total = 0;
  products.forEach((product) => {
    total += product.price;
  });

  const order = new Order({
    products,
    total,
  });
  order.save();
  return order;
};
