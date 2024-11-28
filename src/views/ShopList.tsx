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
import { Shop } from '@/interfaces'
import { ShopTable } from '@/components/ShopTable'
import { UpdateShopForm } from '@/components/UpdateShopForm'
import { DeleteShopConfirmation } from '@/components/DeleteShopConfirmation'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import NewShop from '@/components/NewShop'
import SkeletonLoader from '@/components/SkeletonLoader'

export default function ShopList() {
  const [shops, setShops] = useState<Shop[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<keyof Shop>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setIsLoading] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchShops()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateModalOpen, isUpdateModalOpen, isDeleteModalOpen])

  const fetchShops = async () => {
    try {
      setIsLoading(true)
      const res: any = await api('GET', 'shops')
      const data = await res.json()
      if (res.ok) {
        setShops(data)
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

  const filteredShops = shops.filter((shop) =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedShops = [...filteredShops].sort((a, b) => {
    const aValue = a[sortBy] ?? ''
    const bValue = b[sortBy] ?? ''

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const itemsPerPage = 10
  const totalPages = Math.ceil(sortedShops.length / itemsPerPage)
  const paginatedShops = sortedShops.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSort = (column: keyof Shop) => {
    if (column === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const handleUpdate = (shop: Shop) => {
    setSelectedShop(shop)
    setIsUpdateModalOpen(true)
  }

  const handleDelete = (shop: Shop) => {
    setSelectedShop(shop)
    setIsDeleteModalOpen(true)
  }

  const handleUpdateShop = async (updatedShop: Shop) => {
    try {
      const res: any = await api(
        'PATCH',
        `shops/${updatedShop._id}`,
        updatedShop
      )
      const data = await res.json()
      if (res.ok) {
        fetchShops()
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

  const handleDeleteShop = async (shop_id: string) => {
    fetchShops()
    setIsDeleteModalOpen(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">All Shops</h1>
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex justify-end">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="mb-4 md:mb-0"
          >
            Add New Shop
          </Button>
        </div>
        <Input
          type="text"
          placeholder="Search shops..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64 border !border-black"
        />
      </div>
      {loading ? (
        <SkeletonLoader />
      ) : (
        <ShopTable
          shops={paginatedShops}
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
            <DialogTitle>Add New Shop</DialogTitle>
          </DialogHeader>
          <NewShop onClose={setIsCreateModalOpen} />
        </DialogContent>
      </Dialog>

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Shop</DialogTitle>
          </DialogHeader>
          {selectedShop && (
            <UpdateShopForm
              shop={selectedShop}
              onClose={() => setIsUpdateModalOpen(false)}
              onSubmit={handleUpdateShop}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Shop</DialogTitle>
          </DialogHeader>
          {selectedShop && (
            <DeleteShopConfirmation
              shop={selectedShop}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={() => handleDeleteShop(selectedShop._id)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
