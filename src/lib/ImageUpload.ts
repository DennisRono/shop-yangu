'use client'
// eslint-disable-next-line @next/next/no-async-client-component
const ImageUpload = async (file: File | null, user_id: string) => {
  if (file) {
    try {
      const form = new FormData()
      form.set('file', file)
      form.set('user_id', user_id)
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`,
        {
          method: 'POST',
          body: form,
          headers: {},
        }
      )
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message)
      }

      return data.imgUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  } else {
    console.log('No File')
    return null
  }
}

export default ImageUpload
