import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  // Pass pathname in REQUEST headers so server components can read it via headers()
  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', req.nextUrl.pathname)

  return NextResponse.next({
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
