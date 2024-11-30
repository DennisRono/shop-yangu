import mongoose, { Schema, Document } from 'mongoose'

export interface IShop extends Document {
  name: string
  description: string
  logo: string
}

const ShopSchema: Schema = new Schema<IShop>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    logo: { type: String, required: true },
  },
  { timestamps: true }
)

const Shop = mongoose.models?.Shop || mongoose.model<IShop>('Shop', ShopSchema)

export default Shop
