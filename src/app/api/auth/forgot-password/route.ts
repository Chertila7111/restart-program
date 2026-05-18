import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import { sendPasswordResetEmail } from '@/lib/mailer'

const secret = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'fallback-secret-change-me'
)

export async function POST(req: NextRequest) {
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
