import Image from 'next/image'
import { useState } from 'react'

const CImage = ({ logo, name }: { logo: string; name: string }) => {
  const [imgSrc, setImgSrc] = useState(logo)

  return (
    <Image
      src={imgSrc}
      alt={name}
      width={50}
      height={50}
      className="object-cover"
      onError={() => {
        setImgSrc('/shop.png')
      }}
    />
  )
}

export default CImage
