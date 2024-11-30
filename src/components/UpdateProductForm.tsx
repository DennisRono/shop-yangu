'use client'

import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Product } from '@/interfaces'
import { Loader2 } from 'lucide-react'
import FileUpload from './FileUpload'
import { useAppSelector } from '@/store/hooks'

interface UpdateProductFormProps {
  product: Product
  onClose: () => void
  onSubmit: (product: Product) => Promise<void>
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required').trim(),
  price: Yup.number()
    .positive('Price must be positive')
    .required('Price is required'),
  stock_level: Yup.number()
    .integer('Stock level must be an integer')
    .min(0, 'Stock level must be non-negative')
    .required('Stock level is required'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters long')
    .trim(),
  images: Yup.array()
    .of(Yup.string().url('Invalid image URL'))
    .min(1, 'At least one product image is required')
    .max(20, 'Maximum of 20 images allowed'),
  thumbnail: Yup.number()
    .nullable()
    .test(
      'valid-thumbnail',
      'Invalid thumbnail selection',
      function (value: any) {
        const { images } = this.parent
        return (
          value === null ||
          (Number.isInteger(value) && value >= 0 && value < images.length)
        )
      }
    ),
})

export function UpdateProductForm({
  product,
  onClose,
  onSubmit,
}: UpdateProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const user = useAppSelector((state: any) => state.identity.user)

  const formik = useFormik({
    initialValues: {
      name: product.name,
      price: product.price.toString(),
      stock_level: product.stock_level.toString(),
      description: product.description,
      images: product.images,
      thumbnail: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true)
      try {
        await onSubmit({
          ...product,
          name: values.name,
          price: parseFloat(values.price),
          stock_level: parseInt(values.stock_level),
          description: values.description,
          images: values.images,
          thumbnail: values.images[values.thumbnail || 0],
        })
        onClose()
      } catch (error) {
        console.error('Error updating product:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input
          id="name"
          name="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
        />
        {formik.touched.name && formik.errors.name && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
        )}
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.price}
        />
        {formik.touched.price && formik.errors.price && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.price}</div>
        )}
      </div>
      <div>
        <Label htmlFor="stock_level">Stock Level</Label>
        <Input
          id="stock_level"
          name="stock_level"
          type="number"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.stock_level}
        />
        {formik.touched.stock_level && formik.errors.stock_level && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.stock_level}
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.description}
        />
        {formik.touched.description && formik.errors.description && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.description}
          </div>
        )}
      </div>
      <div>
        <Label>Product Images</Label>
        <FileUpload
          images={formik.values.images}
          setImages={(images) => formik.setFieldValue('images', images)}
          thumbnail={formik.values.thumbnail}
          setThumbnail={(index) => formik.setFieldValue('thumbnail', index)}
          userId={user.user_id}
        />
        {formik.touched.images && formik.errors.images && (
          <div className="text-red-500 text-sm mt-1">
            {formik.errors.images}
          </div>
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
          Update Product
        </Button>
      </div>
    </form>
  )
}
