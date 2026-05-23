import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

function cid() {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(`register:${getClientIp(req)}`, 5, 15 * 60_000)
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Слишком много попыток. Попробуйте через несколько минут.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  try {
    const { name, email, phone, password } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 })
    }

    if (typeof name !== 'string' || name.length > 100) {
      return NextResponse.json({ error: 'Имя слишком длинное' }, { status: 400 })
    }
    if (typeof email !== 'string' || email.length > 254) {
      return NextResponse.json({ error: 'Некорректный email' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Пароль должен содержать минимум 8 символов' }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (exists) {
      return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await ensureDb()

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        passwordHash,
      },
    })

    // Record consent — must succeed; if it fails, roll back the user so registration is atomic
    try {
      for (const c of ['general', 'sensitive'] as const) {
        await (prisma as any).$executeRawUnsafe(
          `INSERT INTO "ConsentLog" (id, userId, consentType, consentVersion, accepted, acceptedAt)
           VALUES (?, ?, ?, 1, 1, CURRENT_TIMESTAMP)`,
          cid(), user.id, c,
        )
      }
    } catch (consentErr) {
      await prisma.user.delete({ where: { id: user.id } }).catch(() => {})
      console.error('ConsentLog insert failed, user rolled back:', consentErr)
      return NextResponse.json({ error: 'Не удалось записать согласие. Попробуйте ещё раз.' }, { status: 500 })
    }

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}
