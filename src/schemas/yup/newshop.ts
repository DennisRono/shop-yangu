import * as Yup from 'yup'

export const newShopSchema = Yup.object().shape({
  shopName: Yup.string().required('Shop Name is required'),
  shopDescription: Yup.string().required('Shop Description is required'),
  shopLogo: Yup.mixed().required('Shop Logo is required'),
})
