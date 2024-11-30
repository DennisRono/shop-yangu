import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/config/database_connection'
import Shop from '@/schemas/mongoose/ShopsSchema'
import Product from '@/schemas/mongoose/ProductsSchema'
import CustomError from '@/lib/CustomError'

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const params = await props.params
    const id: string = params.id
    const { newShopId } = await request.json()

    if (!id || !newShopId) {
      throw new CustomError('Missing shop IDs', 400)
    }

    const isConnected = await connectDB()
    if (!isConnected) {
      throw new CustomError('Failed to connect to database', 500)
    }

    const [oldShop, newShop] = await Promise.all([
      Shop.findById(id),
      Shop.findById(newShopId),
    ])

    if (!oldShop || !newShop) {
      throw new CustomError('One or both shops not found', 404)
    }

    await Product.updateMany({ shop_id: id }, { $set: { shop_id: newShopId } })

    await Shop.findByIdAndDelete(id)

    return NextResponse.json(
      { message: 'Products reassigned and shop deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    if (error instanceof CustomError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      )
    }
    return NextResponse.json(
      { message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
