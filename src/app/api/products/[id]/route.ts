'use server'
import { NextRequest, NextResponse } from 'next/server'
import CustomError from '@/lib/CustomError'
import connectDB from '@/config/database_connection'
import Product from '@/schemas/mongoose/ProductsSchema'

export async function DELETE(
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
    const deletedShop = await Product.findByIdAndDelete(id)
    if (!deletedShop) {
      throw new CustomError('Product not found', 404)
    }

    return NextResponse.json(
      { message: 'Product deleted successfully!', shop: deletedShop },
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
    console.log(body)
    const updatedShop = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!updatedShop) {
      throw new CustomError('Product not found', 404)
    }

    return NextResponse.json(
      { message: 'Product updated successfully!', shop: updatedShop },
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
