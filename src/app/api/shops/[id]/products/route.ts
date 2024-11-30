'use server'
import { NextRequest, NextResponse } from 'next/server'
import CustomError from '@/lib/CustomError'
import connectDB from '@/config/database_connection'
import Product from '@/schemas/mongoose/ProductsSchema'
import { ObjectId } from 'mongodb'

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const id: string = params.id
    if (!id) {
      throw new CustomError('no id in URL', 500)
    }
    const isConnected = await connectDB()
    if (!isConnected) {
      throw new CustomError('Failed to connect to database', 500)
    }

    const products = await Product.aggregate([
      {
        $match: {
          shop_id: new ObjectId(id),
        },
      },
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
