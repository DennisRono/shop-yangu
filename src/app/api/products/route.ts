'use server'
import { NextRequest, NextResponse } from 'next/server'
import CustomError from '@/lib/CustomError'
import connectDB from '@/config/database_connection'
import Product from '@/schemas/mongoose/ProductsSchema'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const isConnected = await connectDB()
    if (!isConnected) {
      throw new CustomError('Failed to connect to database', 500)
    }

    if (Array.isArray(data)) {
      const savedProducts = []
      for (const product of data) {
        const newProduct = new Product(product)
        await newProduct.save()
        savedProducts.push(newProduct)
      }
      return NextResponse.json(
        { message: 'Products added successfully!', products: savedProducts },
        { status: 201 }
      )
    } else {
      const newProduct = new Product(data)
      await newProduct.save()
      return NextResponse.json(
        { message: 'Product added successfully!', product: newProduct },
        { status: 201 }
      )
    }
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    const statusCode = error instanceof CustomError ? error.statusCode : 500
    return NextResponse.json(
      { message: error.message || 'An unexpected error occurred' },
      { status: statusCode }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const isConnected = await connectDB()
    if (!isConnected) {
      throw new CustomError('Failed to connect to database', 500)
    }

    const products = await Product.aggregate([
      {
        $lookup: {
          from: 'shops',
          localField: 'shop_id',
          foreignField: '_id',
          as: 'shop',
        },
      },
      {
        $unwind: {
          path: '$shop',
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
    return NextResponse.json(products)
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: error.message }, { status: 400 })
    }
    const statusCode = error instanceof CustomError ? error.statusCode : 500
    return NextResponse.json(
      { message: error.message || 'An unexpected error occurred' },
      { status: statusCode }
    )
  }
}
