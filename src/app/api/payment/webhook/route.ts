import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.event === 'payment.succeeded') {
      const paymentId = body.object?.id
      const orderId = body.object?.metadata?.orderId

      if (orderId) {
        await prisma.order.update({
          where: { id: orderId },
          data: { status: 'paid', paymentId },
        })
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
