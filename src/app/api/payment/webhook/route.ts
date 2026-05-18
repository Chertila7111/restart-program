import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/mailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.event === 'payment.succeeded') {
      const paymentId = body.object?.id
      const orderId = body.object?.metadata?.orderId

      if (orderId) {
        const order = await prisma.order.update({
          where: { id: orderId },
          data: { status: 'paid', paymentId },
        })

        // Send welcome email with access info
        sendWelcomeEmail({
          to: order.email,
          name: order.name,
          product: order.product,
          productName: order.productName,
        }).catch(err => console.error('Email send failed:', err))
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
