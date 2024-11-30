import { NextRequest, NextResponse } from 'next/server'

export default async function middleware(request: NextRequest) {
  const url = new URL(request.url)
  if (url.hostname === 'res.cloudinary.com') {
    try {
      const imageResponse = await fetch(request.url, {
        method: 'HEAD',
        cache: 'no-store',
      })

      if (imageResponse.ok) {
        return NextResponse.next()
      }
      return NextResponse.redirect(
        new URL(
          'https://cdn-icons-png.flaticon.com/512/2474/2474161.png',
          request.url
        )
      )
    } catch (error) {
      return NextResponse.redirect(
        new URL(
          'https://cdn-icons-png.flaticon.com/512/2474/2474161.png',
          request.url
        )
      )
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/images/:path*',
  ],
}
