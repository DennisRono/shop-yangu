'use client'
import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { newProductSchema } from '@/schemas/yup/newproduct'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import FileUpload from './FileUpload'
import { useAppSelector } from '@/store/hooks'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface NewProductProps {
  onClose: () => void
}
interface Shop {
  _id: string
  name: string
  description: string
}

const NewProduct: React.FC<NewProductProps> = ({ onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shops, setShops] = useState<Shop[]>([])
  const user = useAppSelector((state: any) => state.identity.user)
  const { toast } = useToast()

  useEffect(() => {
    const fetchShops = async () => {
      try {
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
          description: `Failed to fetch shops: ${error.message}`,
          variant: 'destructive',
        })
      }
    }

    fetchShops()
  }, [toast])

  const formik = useFormik({
    initialValues: {
      name: '',
      shop_id: '67472dad652af0316c1368ce',
      price: '',
      stock_level: '',
      description: '',
      images: [] as string[],
      thumbnail: null as number | null,
    },
    validationSchema: newProductSchema,
    onSubmit: async (values) => {
      console.log(values)
      setIsSubmitting(true)
      try {
        try {
          const res: any = await api('POST', 'products', {
            ...values,
            thumbnail: values.images[values.thumbnail || 0],
          })
          const data = await res.json()
          if (res.ok) {
            onClose()
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
      } catch (error) {
        console.error('Error submitting product:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  const { errors, touched, values, handleChange, handleSubmit, setFieldValue } =
    formik

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[80vh] overflow-y-auto scrollbar-none scrollbar-thumb-gray-900 scrollbar-track-transparent px-1"
    >
      <div>
        <Label htmlFor="shop_id">Shop</Label>
        <Select
          name="shop_id"
          value={values.shop_id}
          onValueChange={(value) => setFieldValue('shop_id', value)}
        >
          <SelectTrigger
            className={
              errors.shop_id && touched.shop_id ? 'border-red-500' : ''
            }
          >
            <SelectValue placeholder="Select a shop" />
          </SelectTrigger>
          <SelectContent>
            {shops.map((shop) => (
              <SelectItem key={shop._id} value={shop._id}>
                {shop.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {touched.shop_id && errors.shop_id && (
          <p className="text-red-500 text-sm mt-1">{errors.shop_id}</p>
        )}
      </div>
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          className={errors.name && touched.name ? 'border-red-500' : ''}
        />
        {touched.name && errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            value={values.price}
            onChange={handleChange}
            placeholder="e.g., 5000"
            type="number"
            className={errors.price && touched.price ? 'border-red-500' : ''}
          />
          {touched.price && errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>
        <div className="flex-1">
          <Label htmlFor="stock_level">Stock Level</Label>
          <Input
            id="stock_level"
            name="stock_level"
            value={values.stock_level}
            onChange={handleChange}
            placeholder="e.g., 10"
            type="number"
            className={
              errors.stock_level && touched.stock_level ? 'border-red-500' : ''
            }
          />
          {touched.stock_level && errors.stock_level && (
            <p className="text-red-500 text-sm mt-1">{errors.stock_level}</p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={values.description}
          onChange={handleChange}
          className={
            errors.description && touched.description ? 'border-red-500' : ''
          }
        />
        {touched.description && errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>
      <div>
        <Label>Product Images</Label>
        <FileUpload
          images={values.images}
          setImages={(images) => setFieldValue('images', images)}
          thumbnail={values.thumbnail}
          setThumbnail={(index) => setFieldValue('thumbnail', index)}
          userId={user.user_id}
        />
        {touched.images && errors.images && (
          <p className="text-red-500 text-sm mt-1">{errors.images}</p>
        )}
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Create Product
        </Button>
      </div>
    </form>
  )
}

export default NewProduct
