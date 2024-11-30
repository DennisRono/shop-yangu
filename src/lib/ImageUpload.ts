/* eslint-disable @next/next/no-async-client-component */
'use client'

const ImageUpload = async (
  file: File | null,
  user_id: string,
  onProgress?: (progress: number) => void
): Promise<string | null> => {
  if (!file) {
    console.log('No File')
    return null
  }

  try {
    const form = new FormData()
    form.set('file', file)
    form.set('user_id', user_id)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/upload`, true)

    return new Promise((resolve, reject) => {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percentComplete = (event.loaded / event.total) * 100
          onProgress(percentComplete)
        }
      }

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          resolve(response.imgUrl)
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      }

      xhr.onerror = () => {
        reject(new Error('Network error occurred during upload'))
      }

      xhr.send(form)
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}

export default ImageUpload
