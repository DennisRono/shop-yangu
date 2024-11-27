import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  shop: Schema.Types.ObjectId
  name: string
  price: number
  stock_level: number
  description: string
  image: string | string[]
}

const ProductSchema: Schema = new Schema<IProduct>(
  {
    shop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock_level: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
)

const Product =
  mongoose.models?.Product || mongoose.model<IProduct>('Product', ProductSchema)

export default Product
