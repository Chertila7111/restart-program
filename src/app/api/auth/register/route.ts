import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Пароль должен содержать минимум 8 символов' }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    if (exists) {
      return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        passwordHash,
      },
    })

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}
