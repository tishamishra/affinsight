import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // For now, allow all admin routes without middleware authentication
  // Authentication will be handled on the client side
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
}; 