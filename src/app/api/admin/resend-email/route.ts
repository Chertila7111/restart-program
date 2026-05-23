import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import { sendWelcomeEmail } from '@/lib/mailer'
import { logAudit } from '@/lib/audit'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const role = (session?.user as any)?.role as string
    const actorId = (session?.user as any)?.id as string
    if (!session || role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { orderId } = await req.json()
    if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 })

    await ensureDb()

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    if (!['paid', 'paid_email_failed'].includes(order.status)) {
      return NextResponse.json(
        { error: `Cannot resend for order with status: ${order.status}` },
        { status: 422 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email: order.email } })

    try {
      await sendWelcomeEmail({
        to: order.email,
        name: order.name,
        product: order.product,
        productName: order.productName,
        tempPassword: undefined,
      })

      await prisma.order.update({ where: { id: orderId }, data: { status: 'paid' } })

      await logAudit({
        actorId, actorRole: role, action: 'resend_email',
        targetUserId: user?.id, entityType: 'Order', entityId: orderId,
      })

      return NextResponse.json({ ok: true, email: order.email, userId: user?.id ?? null })
    } catch (err: any) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'paid_email_failed' },
      }).catch(() => {})

      return NextResponse.json(
        { error: 'Email send failed again', detail: err?.message },
        { status: 502 }
      )
    }
  } catch (error) {
    console.error('resend-email error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
