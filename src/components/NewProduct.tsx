'use client'

import { useState } from 'react'
import { useFormik } from 'formik'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { newProductSchema } from '@/schemas/yup/newproduct'
import { Product } from '@/interfaces'

interface NewProductProps {
  onClose: () => void
  onSubmit: (product: Omit<Product, 'id'>) => Promise<void>
}

const NewProduct: React.FC<NewProductProps> = ({ onClose, onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: '',
      shop_id: '',
      price: '',
      stock_level: '',
      description: '',
      image: null,
    },
    validationSchema: newProductSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true)
      try {
        await onSubmit(values as Omit<Product, 'id'>)
        onClose()
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
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <div>
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
      <div>
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
        <Label htmlFor="image">Image</Label>
        <Input
          id="image"
          name="image"
          type="file"
          onChange={(e) =>
            setFieldValue('image', e.currentTarget.files?.[0] || null)
          }
          className={errors.image && touched.image ? 'border-red-500' : ''}
        />
        {touched.image && errors.image && (
          <p className="text-red-500 text-sm mt-1">{errors.image}</p>
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
