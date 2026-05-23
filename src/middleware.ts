import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware() {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/specialist/:path*',
    '/curator/:path*',
    '/admin/:path*',
    '/api/dashboard/:path*',
    '/api/specialist/:path*',
    '/api/curator/:path*',
    '/api/admin/:path*',
    '/api/user/:path*',
    '/api/messages/:path*',
    '/api/conversations/:path*',
    '/api/bookings/:path*',
    '/api/upload',
    '/api/uploads/:path*',
  ],
}
