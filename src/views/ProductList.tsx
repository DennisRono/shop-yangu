'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import NewProduct from '@/components/NewProduct'
import { Product } from '@/interfaces'
import { ProductTable } from '@/components/ProductTable'
import { UpdateProductForm } from '@/components/UpdateProductForm'
import { DeleteProductConfirmation } from '@/components/DeleteProductConfirmation'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import SkeletonLoader from '@/components/SkeletonLoader'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function ProductListingPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [shops, setShops] = useState<any[]>([])
  const [sortBy, setSortBy] = useState<keyof Product>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setIsLoading] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [filters, setFilters] = useState({
    shop: 'all',
    priceRange: [0, 20000],
    stockRange: [0, 20000],
    search: '',
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateModalOpen, isUpdateModalOpen, isDeleteModalOpen])

  useEffect(() => {
    setFilters({
      ...filters,
      priceRange: findMinAndMax(
        products.map((prod: any) => parseInt(prod.price))
      ),
      stockRange: findMinAndMax(
        products.map((prod: any) => parseInt(prod.stock_level))
      ),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const res: any = await api('GET', 'products')
      const data = await res.json()
      if (res.ok) {
        setProducts(data)
        setShops(data.map((i: any) => i.shop))
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name
      ?.toLowerCase()
      .includes(filters.search.toLowerCase())
    const withinPriceRange =
      product.price >= filters.priceRange[0] &&
      product.price <= filters.priceRange[1]
    const withinStockRange =
      product.stock_level >= filters.stockRange[0] &&
      product.stock_level <= filters.stockRange[1]
    const matchesShop =
      filters.shop === 'all' || product.shop?._id === filters.shop
    return matchesSearch && withinPriceRange && withinStockRange && matchesShop
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortBy] ?? ''
    const bValue = b[sortBy] ?? ''

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const itemsPerPage = 10
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = (column: keyof Product) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const handleUpdate = (product: Product) => {
    setSelectedProduct(product)
    setIsUpdateModalOpen(true)
  }

  const handleDelete = (product: Product) => {
    setSelectedProduct(product)
    setIsDeleteModalOpen(true)
  }

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const { _id, __v, createdAt, updatedAt, ...updprod } = updatedProduct
      const res: any = await api(
        'PATCH',
        `products/${updatedProduct._id}`,
        updprod
      )
      const data = await res.json()
      if (res.ok) {
        fetchProducts()
        setIsUpdateModalOpen(false)
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      const res: any = await api('DELETE', `products/${productId}`)
      const data = await res.json()
      if (res.ok) {
        fetchProducts()
        setIsDeleteModalOpen(false)
      } else {
        throw new Error(data.message)
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const findMinAndMax = (arr: number[]) => {
    if (arr.length === 0) return [0, 20000]
    return [Math.min(...arr), Math.max(...arr)]
  }

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
    setCurrentPage(1)
  }

  const handlePriceRangeChange = (value: any) => {
    handleFilterChange('priceRange', [0, parseInt(value, 10)])
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Product Management</h1>
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex justify-end">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="mb-4 md:mb-0"
          >
            Add New Product
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full md:w-64 border !border-black"
          />
          <div className="w-[200px]">
            <Select
              name="shop_id"
              value={filters.shop}
              onValueChange={(value: any) => {
                handleFilterChange('shop', value)
              }}
            >
              <SelectTrigger className="border border-black">
                <SelectValue placeholder="Select a shop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select a Shop</SelectItem>
                {shops.map((shop: any, i) => (
                  <SelectItem key={i} value={shop._id}>
                    {shop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-sm ml-1">Price Range</h2>
            <input
              type="range"
              min={
                findMinAndMax(
                  products.map((prod: any) => parseInt(prod.price))
                )[0]
              }
              max={
                findMinAndMax(
                  products.map((prod: any) => parseInt(prod.price))
                )[1]
              }
              step="10"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceRangeChange(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between -mt-1">
              <span className="text-xs">{0}</span>
              <span className="text-xs">{filters.priceRange[1]}</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-sm ml-1">Stock Range</h2>
            <input
              type="range"
              min={
                findMinAndMax(
                  products.map((prod: any) => parseInt(prod.stock_level))
                )[0]
              }
              max={
                findMinAndMax(
                  products.map((prod: any) => parseInt(prod.stock_level))
                )[1]
              }
              step="1"
              value={filters.stockRange[1]}
              onChange={(e) =>
                handleFilterChange('stockRange', [
                  0,
                  parseInt(e.target.value, 10),
                ])
              }
              className="w-full"
            />
            <div className="flex justify-between -mt-1">
              <span className="text-xs">{0}</span>
              <span className="text-xs">{filters.stockRange[1]}</span>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <ProductTable
          products={paginatedProducts}
          onSort={handleSort}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}

      <div className="mt-4 flex justify-between items-center">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <NewProduct
            onClose={() => {
              setIsCreateModalOpen(false)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Product</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <UpdateProductForm
              product={selectedProduct}
              onClose={() => {
                setIsCreateModalOpen(false)
              }}
              onSubmit={handleUpdateProduct}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <DeleteProductConfirmation
              product={selectedProduct}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={() => handleDeleteProduct(selectedProduct._id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
