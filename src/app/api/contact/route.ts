import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })
    }

    await prisma.lead.create({
      data: { name, email, phone: phone || null, message, source: 'contact_form' },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
