import { cloudinary } from '@/config/cloudinary'
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary'

type UploadResponse =
  | { success: true; result?: UploadApiResponse }
  | { success: false; error: UploadApiErrorResponse }

export const uploadToCloudinary = async (
  fileUri: string,
  fileName: string,
  folder: string
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload(fileUri, {
        invalidate: true,
        resource_type: 'auto',
        filename_override: fileName,
        folder: 'nullcommerce/' + folder,
        use_filename: true,
        eager: [
          {
            transformation: [
              { width: 800, height: 800, crop: 'fit' },
              {
                color: 'E1D6FF87',
                overlay: 'text:roboto_18_bold_normal_left:nullchemy shop',
                gravity: 'center',
                x: 50,
                y: -20,
                flags: 'layer_apply',
              },
            ],
            format: 'webp',
          },
        ],
      })
      .then((result: any) => {
        resolve({ success: true, result })
      })
      .catch((error: any) => {
        reject({ success: false, message: error.message, error })
      })
  })
}
