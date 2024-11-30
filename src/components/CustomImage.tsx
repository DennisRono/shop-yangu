import { useState } from 'react'
import Image from 'next/image'

const CImage = ({ logo, name }: { logo: string; name: string }) => {
  const [imgSrc, setImgSrc] = useState(logo)

  return (
    <Image
      src={`${imgSrc}${imgSrc.includes('?') ? '&' : '?'}i=${Math.random()
        .toString(36)
        .substr(2, 9)}`}
      alt={name}
      width={50}
      height={50}
      className="object-cover"
      onError={() => {
        setImgSrc('https://cdn-icons-png.flaticon.com/512/2474/2474161.png')
      }}
    />
  )
}

export default CImage
