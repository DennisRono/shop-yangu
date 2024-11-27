import * as yup from 'yup'

export const newProductSchema = yup.object().shape({
  name: yup.string().required('Product name is required.'),
  price: yup
    .number()
    .required('Price is required.')
    .typeError('Price must be a valid number.')
    .min(0, 'Price must be a positive value.'),
  stock: yup
    .number()
    .required('Stock level is required.')
    .typeError('Stock level must be a valid number.')
    .min(0, 'Stock level cannot be negative.'),
  description: yup
    .string()
    .required('Product description is required.')
    .min(10, 'Description must be at least 10 characters long.'),
  image: yup
    .mixed()
    .required('Product image is required.')
    .test(
      'fileType',
      'Only image files are allowed.',
      (value: any) =>
        !value ||
        (value && ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type))
    )
    .test(
      'fileSize',
      'Image file size must be less than 5MB.',
      (value: any) => !value || (value && value.size <= 5 * 1024 * 1024)
    ),
})
