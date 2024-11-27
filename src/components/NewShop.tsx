'use client'
import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { newShopSchema } from '@/schemas/yup/newshop'

const NewShop = () => {
  const handleSubmit = (values: any, { setSubmitting }: any) => {
    console.log(values)
    setSubmitting(false)
  }

  return (
    <div className="mx-auto px-4 py-8 max-w-[400px]">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Shop</CardTitle>
          <CardDescription>Enter the details for your new shop</CardDescription>
        </CardHeader>
        <Formik
          initialValues={{ shopName: '', shopDescription: '', shopLogo: null }}
          validationSchema={newShopSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <CardContent className="space-y-4">
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

                <div className="space-y-2">
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
              </CardContent>

              <CardFooter>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Creating...' : 'Create Shop'}
                </Button>
              </CardFooter>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  )
}

export default NewShop
