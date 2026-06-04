import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  
  // 1. Check for 'v=2' in query params
  const versionQuery = request.nextUrl.searchParams.get('v')
  
  // 2. Check for 'site-version' cookie
  const cookieVersion = request.cookies.get('site-version')?.value

  // Logic: If user specifically asks for v2 OR has the cookie set
  if (versionQuery === '2' || cookieVersion === '2') {
    const response = NextResponse.next()
    
    // Set a cookie so they stay on v2
    if (versionQuery === '2') {
      response.cookies.set('site-version', '2', { maxAge: 60 * 60 * 24 * 7 }) // 1 week
    }

    // Rewrite the root path to v2 internally
    if (url.pathname === '/') {
      url.pathname = '/v2'
      return NextResponse.rewrite(url)
    }
    
    return response
  }

  // Allow clearing v2 by setting v=1
  if (versionQuery === '1') {
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.set('site-version', '1', { maxAge: 60 * 60 * 24 * 7 })
    return response
  }

  return NextResponse.next()
}

// Only run middleware on the home page and /v2 paths for now
export const config = {
  matcher: ['/', '/v2/:path*'],
}
