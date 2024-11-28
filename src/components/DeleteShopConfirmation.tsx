'use client'
import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Shop, Product } from '@/interfaces'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { api } from '@/lib/api'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface DeleteShopConfirmationProps {
  shop: Shop
  onClose: () => void
  onConfirm: (shop: Shop) => void
}

export function DeleteShopConfirmation({
  shop,
  onClose,
  onConfirm,
}: DeleteShopConfirmationProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [otherShops, setOtherShops] = useState<Shop[]>([])
  const [selectedShop, setSelectedShop] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [deleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [productsResponse, shopsResponse]: any = await Promise.all([
          api('GET', `shops/${shop._id}/products`),
          api('GET', 'shops'),
        ])

        const productsData = await productsResponse.json()
        const shopsData = await shopsResponse.json()
        console.log(productsData, shopsData)

        setProducts(productsData)
        setOtherShops(shopsData.filter((s: Shop) => s._id !== shop._id))
      } catch (err) {
        setError('Failed to fetch data. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [shop._id])

  const handleReassignProducts = async () => {
    if (!selectedShop) {
      setError('Please select a shop to reassign products.')
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      await api('POST', `shops/${shop._id}/reassign-products`, {
        newShopId: selectedShop,
      })
      onConfirm(shop)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: `Failed to ressign: ${error.message}`,
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const deleteShop = async () => {
    if (products.length === 0) {
      try {
        setIsDeleting(true)
        const res: any = api('DELETE', `shop/${shop._id}`)
        const data = await res.json()
        if (res.ok) {
          toast({
            title: 'Deleted',
            description: data.message,
          })
        } else {
          throw new Error(data.message)
        }
      } catch (error: any) {
        toast({
          title: 'Error',
          description: `Failed to delete shop: ${error.message}`,
          variant: 'destructive',
        })
      } finally {
        setIsDeleting(false)
      }
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Shop: {shop.name}</DialogTitle>
          <DialogDescription>
            {products.length > 0
              ? `This shop has ${products.length} active product(s). You must reassign these products before deleting the shop.`
              : 'Are you sure you want to delete this shop? This action cannot be undone.'}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {products.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold">Products to reassign:</h3>
                <ul className="list-disc pl-5">
                  {products.map((product) => (
                    <li key={product._id}>{product.name}</li>
                  ))}
                </ul>
                <div className="space-y-2">
                  <Label htmlFor="shop-select">
                    Select shop to reassign products:
                  </Label>
                  <Select onValueChange={setSelectedShop} value={selectedShop}>
                    <SelectTrigger id="shop-select">
                      <SelectValue placeholder="Select a shop" />
                    </SelectTrigger>
                    <SelectContent>
                      {otherShops.map((shop) => (
                        <SelectItem key={shop._id} value={shop._id}>
                          {shop.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {products.length > 0 ? (
            <Button
              onClick={handleReassignProducts}
              disabled={isLoading || !selectedShop}
            >
              Reassign and Delete
            </Button>
          ) : (
            <Button
              variant="destructive"
              onClick={() => onConfirm(shop)}
              disabled={isLoading && deleting}
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
