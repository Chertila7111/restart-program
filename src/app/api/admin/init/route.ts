import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  // Rate limit: 5 attempts per hour per IP
  const ip = getClientIp(req)
  const rl = checkRateLimit(`admin-init:${ip}`, 5, 60 * 60_000)
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  try {
    const setupKey = process.env.ADMIN_SETUP_KEY
    if (!setupKey || setupKey.length < 32) {
      return NextResponse.json({ error: 'Endpoint disabled' }, { status: 403 })
    }

    let body: { setupKey?: string; email?: string; name?: string; password?: string }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Неверный JSON' }, { status: 400 })
    }

    const { setupKey: key, email, name, password } = body

    if (key !== setupKey) {
      return NextResponse.json({ error: 'Неверный ключ доступа' }, { status: 403 })
    }

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Нужны email, name, password' }, { status: 400 })
    }

    const emailLower = email.toLowerCase().trim()

    const existing = await prisma.user.findUnique({ where: { email: emailLower } })

    if (existing) {
      await prisma.user.update({
        where: { email: emailLower },
        data: { role: 'admin', name },
      })
      return NextResponse.json({ message: 'Роль admin обновлена для ' + emailLower })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await prisma.user.create({
      data: { email: emailLower, name, passwordHash, role: 'admin' },
    })

    return NextResponse.json({ message: 'Admin-аккаунт создан: ' + emailLower })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
