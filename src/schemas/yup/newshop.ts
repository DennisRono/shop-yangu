import * as Yup from 'yup'

export const newShopSchema = Yup.object().shape({
  shopName: Yup.string().required('Shop Name is required'),
  shopDescription: Yup.string().required('Shop Description is required'),
  images: Yup.array()
    .of(Yup.string().url('Invalid image URL'))
    .min(1, 'At least one image is required'),
  logo: Yup.number()
    .nullable()
    .test(
      'is-valid-thumbnail',
      'A valid logo (thumbnail) must be selected',
      function (value: any) {
        const { images } = this.parent
        return (
          value === null ||
          (Array.isArray(images) && images[value] !== undefined)
        )
      }
    ),
})
