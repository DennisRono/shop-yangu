'use client'
import { useState } from 'react'
import { useFormik } from 'formik'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { newShopSchema } from '@/schemas/yup/newshop'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import FileUpload from './FileUpload'
import { useAppSelector } from '@/store/hooks'

const NewShop = ({ onClose }: { onClose: (value: any) => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const user = useAppSelector((state: any) => state.identity.user)
  const { toast } = useToast()

  const formik = useFormik({
    initialValues: {
      shopName: '',
      shopDescription: '',
      images: [] as string[],
      logo: null as number | null,
    },
    validationSchema: newShopSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true)
      try {
        const res: any = await api('POST', 'shops', {
          name: values.shopName,
          description: values.shopDescription,
          logo: values.images[values.logo || 0],
        })
        const data = await res.json()
        if (res.ok) {
          onClose(false)
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
        setIsSubmitting(false)
      }
    },
  })

  const { errors, touched, values, handleChange, handleSubmit, setFieldValue } =
    formik

  console.log(values)

  return (
    <form onSubmit={handleSubmit} className="space-y-4  max-h-[80vh]">
      <div>
        <Label htmlFor="shopName">Shop Name</Label>
        <Input
          id="shopName"
          name="shopName"
          value={values.shopName}
          onChange={handleChange}
          placeholder="Enter shop name"
          className={
            errors.shopName && touched.shopName ? 'border-red-500' : ''
          }
        />
        {touched.shopName && errors.shopName && (
          <p className="text-red-500 text-sm mt-1">{errors.shopName}</p>
        )}
      </div>

      <div>
        <Label htmlFor="shopDescription">Shop Description</Label>
        <Textarea
          id="shopDescription"
          name="shopDescription"
          value={values.shopDescription}
          onChange={handleChange}
          placeholder="Enter shop description"
          className={
            errors.shopDescription && touched.shopDescription
              ? 'border-red-500'
              : ''
          }
        />
        {touched.shopDescription && errors.shopDescription && (
          <p className="text-red-500 text-sm mt-1">{errors.shopDescription}</p>
        )}
      </div>

      <div>
        <Label>Shop Logo</Label>
        <FileUpload
          images={values.images}
          setImages={(images) => setFieldValue('images', images)}
          thumbnail={values.logo}
          setThumbnail={(index) => setFieldValue('logo', index)}
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
          {isSubmitting ? 'Creating...' : 'Create Shop'}
        </Button>
      </div>
    </form>
  )
}

export default NewShop
