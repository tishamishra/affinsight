import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow all paths - authentication will be handled on client side
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}; 