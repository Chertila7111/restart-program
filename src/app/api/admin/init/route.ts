import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const setupKey = process.env.ADMIN_SETUP_KEY || 'restart-setup-2026'

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
  } catch (err) {
    console.error('Admin init error:', err)
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: 'Ошибка сервера: ' + msg }, { status: 500 })
  }
}
