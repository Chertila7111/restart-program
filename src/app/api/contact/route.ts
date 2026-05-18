import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendContactEmail } from '@/lib/mailer'

export async function POST(req: NextRequest) {
  const { name, email, phone, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })
  }

  // Save lead to DB — non-fatal if DB unavailable
  try {
    await prisma.lead.create({
      data: { name, email, phone: phone || null, message, source: 'contact_form' },
    })
  } catch (e) {
    console.error('Contact lead save error:', e)
  }

  // Send email notification — fire and forget, never blocks response
  sendContactEmail({ name, email, message }).catch(e => console.error('Contact email error:', e))

  return NextResponse.json({ ok: true })
}
