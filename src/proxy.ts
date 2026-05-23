import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/specialist',
  '/curator',
  '/admin',
  '/api/dashboard',
  '/api/specialist',
  '/api/curator',
  '/api/admin',
  '/api/user',
  '/api/messages',
  '/api/conversations',
  '/api/bookings',
  '/api/upload',
  '/api/uploads',
]

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )

  if (isProtected) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const loginUrl = new URL('/auth/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  const requestHeaders = new Headers(req.headers)
  requestHeaders.set('x-pathname', pathname)
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
