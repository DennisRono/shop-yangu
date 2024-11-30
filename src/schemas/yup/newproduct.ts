import * as yup from 'yup'

export const newProductSchema = yup.object().shape({
  name: yup.string().required('Product name is required.').trim(),
  price: yup
    .number()
    .required('Price is required.')
    .typeError('Price must be a valid number.')
    .positive('Price must be a positive value.'),
  stock_level: yup
    .number()
    .required('Stock level is required.')
    .typeError('Stock level must be a valid number.')
    .integer('Stock level must be a whole number.')
    .min(0, 'Stock level cannot be negative.'),
  description: yup
    .string()
    .required('Product description is required.')
    .trim()
    .min(10, 'Description must be at least 10 characters long.'),
  images: yup
    .array()
    .of(yup.string().url('Invalid image URL'))
    .min(1, 'At least one product image is required.')
    .max(20, 'Maximum of 20 images allowed.'),
  thumbnail: yup
    .number()
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
  shop_id: yup.string().required('Shop ID is required.'),
})
