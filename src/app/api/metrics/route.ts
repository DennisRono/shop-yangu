'use server'
import { NextRequest, NextResponse } from 'next/server'
import CustomError from '@/lib/CustomError'
import connectDB from '@/config/database_connection'
import Shop from '@/schemas/mongoose/ShopsSchema'
import Product from '@/schemas/mongoose/ProductsSchema'

export async function GET(request: NextRequest) {
  try {
    const isConnected = await connectDB()
    if (!isConnected) {
      throw new CustomError('Failed to connect to database', 500)
    }

    const [totalShops, totalProducts, stockAndValue, stockStatus, topShops] =
      await Promise.all([
        Shop.countDocuments({}),
        Product.countDocuments({}),
        Product.aggregate([
          {
            $group: {
              _id: null,
              totalStock: { $sum: '$stock_level' },
              totalValue: { $sum: { $multiply: ['$price', '$stock_level'] } },
            },
          },
        ]),
        Product.aggregate([
          {
            $group: {
              _id: {
                status: {
                  $cond: [
                    { $gte: ['$stock_level', 6] },
                    'In Stock',
                    {
                      $cond: [
                        { $gte: ['$stock_level', 1] },
                        'Low Stock',
                        'Out of Stock',
                      ],
                    },
                  ],
                },
              },
              count: { $sum: 1 },
            },
          },
        ]),
        Product.aggregate([
          {
            $group: {
              _id: '$shop_id',
              totalStock: { $sum: '$stock_level' },
            },
          },
          { $sort: { totalStock: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: 'shops',
              localField: '_id',
              foreignField: '_id',
              as: 'shopDetails',
            },
          },
          {
            $unwind: {
              path: '$shopDetails',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              shop: '$shopDetails',
              totalStock: 1,
            },
          },
        ]),
      ])

    const metrics = {
      totalShops,
      totalProducts,
      totalStock: stockAndValue[0]?.totalStock || 0,
      totalValue: stockAndValue[0]?.totalValue || 0,
      stockDistribution: stockStatus.map((status) => ({
        status: status._id.status,
        count: status.count,
      })),
      topShops: topShops.map((shop) => ({
        shopName: shop.shop?.name || 'deleted shop',
        totalStock: shop.totalStock,
      })),
    }

    return NextResponse.json(metrics, { status: 200 })
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
