import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendContactEmail } from '@/lib/mailer'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

const NAME_MAX = 100
const MESSAGE_MAX = 2000

export async function POST(req: NextRequest) {
  const rl = checkRateLimit(`contact:${getClientIp(req)}`, 5, 10 * 60_000)
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Слишком много запросов. Подождите немного.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  const { name, email, phone, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })
  }
  if (typeof name !== 'string' || name.length > NAME_MAX) {
    return NextResponse.json({ error: 'Имя слишком длинное' }, { status: 400 })
  }
  if (typeof message !== 'string' || message.length > MESSAGE_MAX) {
    return NextResponse.json({ error: 'Сообщение слишком длинное' }, { status: 400 })
  }

  // Save lead to DB — non-fatal if DB unavailable
  try {
    await prisma.lead.create({
      data: { name, email, phone: phone || null, message, source: 'contact_form' },
    })
  } catch {
    // non-fatal
  }

  // Send email notification — fire and forget, never blocks response
  sendContactEmail({ name, email, message }).catch(() => {})

  return NextResponse.json({ ok: true })
}
