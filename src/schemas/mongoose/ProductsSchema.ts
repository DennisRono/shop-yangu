import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  shop_id: Schema.Types.ObjectId
  name: string
  price: number
  stock_level: number
  description: string
  images: string[]
  thumbnail: string
}

const ProductSchema: Schema = new Schema<IProduct>(
  {
    shop_id: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    name: { type: String, required: true, trim: true },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be a positive value.'],
    },
    stock_level: {
      type: Number,
      required: true,
      min: [0, 'Stock level cannot be negative.'],
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value for stock_level',
      },
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, 'Description must be at least 10 characters long.'],
    },
    images: {
      type: [String],
      required: true,
      validate: [
        {
          validator: (array: string[]) => array.length >= 1,
          message: 'At least one product image is required.',
        },
        {
          validator: (array: string[]) => array.length <= 20,
          message: 'Maximum of 20 images allowed.',
        },
      ],
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: function (this: IProduct, value: string) {
          return this.images.includes(value)
        },
        message: 'Thumbnail must be one of the product images.',
      },
    },
  },
  { timestamps: true }
)

const Product =
  mongoose.models?.Product || mongoose.model<IProduct>('Product', ProductSchema)

export default Product
