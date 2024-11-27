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

interface UpdateProductFormProps {
  product: Product
  onClose: () => void
  onSubmit: (product: Product) => Promise<void>
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Product name is required'),
  price: Yup.number()
    .positive('Price must be positive')
    .required('Price is required'),
  stock_level: Yup.number()
    .integer('Stock level must be an integer')
    .min(0, 'Stock level must be non-negative')
    .required('Stock level is required'),
  description: Yup.string().required('Description is required'),
  image: Yup.string().url('Invalid URL').required('Image URL is required'),
})

export function UpdateProductForm({
  product,
  onClose,
  onSubmit,
}: UpdateProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: product.name,
      price: product.price.toString(),
      stock_level: product.stock_level.toString(),
      description: product.description,
      image: typeof product.image === 'string' ? product.image : '',
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
          image: values.image,
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
    <form onSubmit={formik.handleSubmit} className="space-y-4">
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
          <div className="text-red-500">{formik.errors.name}</div>
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
          <div className="text-red-500">{formik.errors.price}</div>
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
          <div className="text-red-500">{formik.errors.stock_level}</div>
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
          <div className="text-red-500">{formik.errors.description}</div>
        )}
      </div>
      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          name="image"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.image}
        />
        {formik.touched.image && formik.errors.image && (
          <div className="text-red-500">{formik.errors.image}</div>
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
