import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths
  if (pathname.startsWith('/auth') || pathname === '/') {
    return NextResponse.next()
  }

  const userEmail = request.cookies.get('user-email')?.value

  if (pathname.startsWith('/admin') && userEmail !== 'vishalgkumar54@gmail.com') {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/unauthorized'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}; 