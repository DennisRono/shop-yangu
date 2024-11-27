'use client'
import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { newShopSchema } from '@/schemas/yup/newshop'
import { useToast } from '@/hooks/use-toast'
import { api } from '@/lib/api'
import { Loader2 } from 'lucide-react'

const NewShop = () => {
  const { toast } = useToast()
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const res: any = await api('POST', `shops`, values)
      const data = await res.json()
      if (res.ok) {
        setSubmitting(false)
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
    <div className="mx-auto w-full h-full">
      <Formik
        initialValues={{ shopName: '', shopDescription: '', shopLogo: null }}
        validationSchema={newShopSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form>
            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name</Label>
              <Field
                as={Input}
                id="shopName"
                name="shopName"
                type="text"
                placeholder="Enter shop name"
              />
              <ErrorMessage
                name="shopName"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopDescription">Shop Description</Label>
              <Field
                as={Textarea}
                id="shopDescription"
                name="shopDescription"
                placeholder="Enter shop description"
              />
              <ErrorMessage
                name="shopDescription"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="space-y-2 mb-4">
              <Label htmlFor="shopLogo">Shop Logo</Label>
              <Input
                id="shopLogo"
                name="shopLogo"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  setFieldValue('shopLogo', event.currentTarget.files?.[0])
                }}
              />
              <ErrorMessage
                name="shopLogo"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isSubmitting ? 'Creating...' : 'Create Shop'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default NewShop
