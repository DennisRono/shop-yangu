'use server'
import { NextRequest, NextResponse } from 'next/server'
import CustomError from '@/lib/CustomError'
import connectDB from '@/config/database_connection'
import Shop from '@/schemas/mongoose/ShopsSchema'
import Product from '@/schemas/mongoose/ProductsSchema'

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const id: string = params.id
    if (!id) {
      throw new CustomError('No id in URL', 400)
    }

    const isConnected = await connectDB()
    if (!isConnected) {
      throw new CustomError('Failed to connect to database', 500)
    }

    const productsCount = await Product.countDocuments({ shop_id: id })
    if (productsCount > 0) {
      return NextResponse.json(
        {
          message: 'Cannot delete shop with active products',
          action:
            'Please remove or reassign all products before deleting this shop.',
          productsCount,
        },
        { status: 400 }
      )
    }

    const deletedShop = await Shop.findByIdAndDelete(id)
    if (!deletedShop) {
      throw new CustomError('Shop not found', 404)
    }

    return NextResponse.json(
      { message: 'Shop deleted successfully!', shop: deletedShop },
      { status: 200 }
    )
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

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const id: string = params.id
    if (!id) {
      throw new CustomError('no id in URL', 500)
    }
    const body = await request.json()
    if (!body || typeof body !== 'object') {
      throw new CustomError('Invalid request body', 400)
    }
    const isConnected = await connectDB()
    if (!isConnected) {
      throw new CustomError('Failed to connect to database', 500)
    }
    const updatedShop = await Shop.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!updatedShop) {
      throw new CustomError('Shop not found', 404)
    }

    return NextResponse.json(
      { message: 'Shop updated successfully!', shop: updatedShop },
      { status: 200 }
    )
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
