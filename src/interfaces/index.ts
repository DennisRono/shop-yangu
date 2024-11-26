export interface Shop {
  id: string
  name: string
  description: string
  logo: string
}

export interface Product {
  id: string
  shopId: string
  name: string
  price: number
  stockLevel: number
  description: string
  image: string
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
  stockLevel: number
}
