import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const jwtSecret = process.env.NEXTAUTH_SECRET
  if (!jwtSecret) return NextResponse.json({ error: 'Ссылка недействительна' }, { status: 400 })
  const secret = new TextEncoder().encode(jwtSecret)

  const { token, password } = await req.json()
  if (!token || !password || password.length < 8) {
    return NextResponse.json({ error: 'Неверные данные' }, { status: 400 })
  }

  let payload: { sub?: string; type?: string }
  try {
    const result = await jwtVerify(token, secret)
    payload = result.payload as typeof payload
  } catch {
    return NextResponse.json({ error: 'Ссылка устарела или недействительна' }, { status: 400 })
  }

  if (payload.type !== 'reset' || !payload.sub) {
    return NextResponse.json({ error: 'Неверный токен' }, { status: 400 })
  }

  try {
    await ensureDb()
    const hash = await bcrypt.hash(password, 12)
    await prisma.user.update({ where: { id: payload.sub }, data: { passwordHash: hash } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка при сохранении пароля' }, { status: 500 })
  }
}
