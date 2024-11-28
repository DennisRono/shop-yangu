'use client'
import { useCallback, useEffect } from 'react'
import { useDropzone, Accept, FileRejection } from 'react-dropzone'
import { toast } from '@/hooks/use-toast'
import ImageUpload from '@/lib/ImageUpload'
import { X } from 'lucide-react'

interface FileUploadProps {
  images: string[]
  setImages: (images: string[]) => void
  thumbnail: number | null
  setThumbnail: (index: number | null) => void
  userId: string
}

const FileRejectionToast = ({ file, errors }: { file: File; errors: any }) => (
  <div>
    <div>{`${file.name} - ${(file.size / 1e6).toFixed(2)} Mb`}</div>
    <ul>
      {errors.map((e: any) => (
        <li key={e.code}>{e.message}</li>
      ))}
    </ul>
  </div>
)

const FileUpload: React.FC<FileUploadProps> = ({
  images,
  setImages,
  thumbnail,
  setThumbnail,
  userId,
}) => {
  const onDrop = useCallback(
    async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const uploadFiles = async (): Promise<void> => {
        const newPaths: string[] = []
        for (const file of acceptedFiles) {
          try {
            const url = await ImageUpload(file, userId)
            if (url) {
              newPaths.push(url)
            }
          } catch (error: any) {
            toast({
              title: 'Error',
              description: `Error uploading ${file.name}: ${error.message}`,
              variant: 'destructive',
            })
          }
        }

        setImages([...images, ...newPaths])
        if (thumbnail === null && newPaths.length > 0) {
          setThumbnail(images.length)
        }
      }

      await uploadFiles()

      fileRejections.forEach(({ file, errors }) => {
        toast({
          title: 'File Rejected',
          description: <FileRejectionToast file={file} errors={errors} />,
          variant: 'destructive',
        })
      })
    },
    [images, setImages, thumbnail, setThumbnail, userId]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
    } as Accept,
    multiple: true,
    maxFiles: 20,
    maxSize: 1e8,
    minSize: 100,
  })

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    if (thumbnail === index) {
      setThumbnail(newImages.length > 0 ? 0 : null)
    } else if (thumbnail !== null && thumbnail > index) {
      setThumbnail(thumbnail - 1)
    }
  }

  useEffect(() => {
    console.log(typeof images)
    console.log(images)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images])

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-gray-300 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? 'Drop the files here ...'
            : 'Drag & drop files here, or click to select files'}
        </p>
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((file, i) => (
            <div
              key={i}
              className={`relative group cursor-pointer rounded-lg overflow-hidden ${
                i === thumbnail ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setThumbnail(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element*/}
              <img src={file} alt="" className="w-full h-32 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs">
                  {i === thumbnail ? 'Default Thumbnail' : 'Set as Thumbnail'}
                </span>
              </div>
              <button
                className="absolute top-1 right-1 p-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(i)
                }}
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload
