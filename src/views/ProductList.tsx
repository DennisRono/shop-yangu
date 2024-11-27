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

export default function ProductListingPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<keyof Product>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchProducts = async () => {
    try {
      const res: any = await api('GET', 'products')
      const data = await res.json()
      if (res.ok) {
        setProducts(data)
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  const handleCreateProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      const res: any = await api('POST', 'products', newProduct)
      const data = await res.json()
      if (res.ok) {
        fetchProducts()
        setIsCreateModalOpen(false)
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

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const res: any = await api('PATCH', 'products', updatedProduct)
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
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64 border !border-black"
        />
      </div>
      <ProductTable
        products={paginatedProducts}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
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
            onClose={() => setIsCreateModalOpen(false)}
            onSubmit={handleCreateProduct}
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
              onClose={() => setIsUpdateModalOpen(false)}
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
