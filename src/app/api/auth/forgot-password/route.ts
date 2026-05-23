import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import { sendPasswordResetEmail } from '@/lib/mailer'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(`forgot:${getClientIp(req)}`, 3, 15 * 60_000)
  if (!rl.ok) {
    return NextResponse.json(
      { ok: true },
      { status: 200, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  const jwtSecret = process.env.NEXTAUTH_SECRET
  if (!jwtSecret) {
    console.error('[forgot-password] NEXTAUTH_SECRET is not set')
    return NextResponse.json({ ok: true })
  }
  const secret = new TextEncoder().encode(jwtSecret)

  const { email } = await req.json()
  if (!email) return NextResponse.json({ ok: false }, { status: 400 })

  const emailLower = email.toLowerCase().trim()

  try {
    await ensureDb()
    const user = await prisma.user.findUnique({ where: { email: emailLower } })
    // Always return ok to prevent user enumeration
    if (!user || !user.passwordHash) return NextResponse.json({ ok: true })

    const token = await new SignJWT({ sub: user.id, email: emailLower, type: 'reset' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secret)

    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://snova-s-soboy.ru'}/auth/reset-password/${token}`
    await sendPasswordResetEmail({ to: emailLower, resetUrl })
  } catch {
    // swallow — return ok regardless to prevent enumeration
  }

  return NextResponse.json({ ok: true })
}
