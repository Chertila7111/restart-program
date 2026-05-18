import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function GET() {
  const key = process.env.RESEND_API_KEY
  if (!key) return NextResponse.json({ error: 'RESEND_API_KEY not set' }, { status: 500 })

  try {
    const resend = new Resend(key)
    const result = await resend.emails.send({
      from: 'Снова с собой <hello@snova-s-soboy.ru>',
      to: 'snovassoboi@yandex.com',
      subject: 'Тест email — Снова с собой',
      html: '<p>Тестовое письмо. Если вы это видите — email работает!</p>',
    })
    return NextResponse.json({ ok: true, result })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message, details: e }, { status: 500 })
  }
}
