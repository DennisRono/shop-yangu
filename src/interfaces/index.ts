export interface Shop {
  _id: string
  name: string
  description: string
  logo: string
}

export interface Product {
  _id: string
  name: string
  price: number
  stock_level: number
  description: string
  image: string[]
  shop?: {
    _id: string
    name: string
    description: string
    logo: string
    createdAt: string
    updatedAt: string
    __v: number
  }
}

export interface DashboardMetrics {
  totalShops: number
  totalProducts: number
  totalValue: number
  totalStock: number
}

export interface StockStatus {
  inStock: number
  outOfStock: number
  lowStock: number
}

export interface TopShop {
  id: string
  name: string
  stock_level: number
}
