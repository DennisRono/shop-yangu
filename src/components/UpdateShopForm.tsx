'use client'
import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Shop } from '@/interfaces'
import { Loader2 } from 'lucide-react'

interface UpdateShopFormProps {
  shop: Shop
  onClose: () => void
  onSubmit: (shop: Shop) => Promise<void>
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Shop name is required'),
  description: Yup.string().required('Description is required'),
  logo: Yup.string().url('Invalid URL').required('Logo URL is required'),
})

export function UpdateShopForm({
  shop,
  onClose,
  onSubmit,
}: UpdateShopFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: shop.name,
      description: shop.description,
      logo: shop.logo,
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true)
      try {
        await onSubmit({
          ...shop,
          name: values.name,
          description: values.description,
          logo: values.logo,
        })
        onClose()
      } catch (error) {
        console.error('Error updating shop:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Shop Name</Label>
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
        <Label htmlFor="logo">Logo URL</Label>
        <Input
          id="logo"
          name="logo"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.logo}
        />
        {formik.touched.logo && formik.errors.logo && (
          <div className="text-red-500">{formik.errors.logo}</div>
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
          Update Shop
        </Button>
      </div>
    </form>
  )
}
