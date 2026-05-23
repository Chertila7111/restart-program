import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id as string
  const { orderId } = await params

  try {
    await ensureDb()

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    // Ownership check
    if (order.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (order.status !== 'paid' && order.status !== 'paid_email_failed') {
      return NextResponse.json({ error: 'Возврат возможен только для оплаченных заказов' }, { status: 422 })
    }

    // Check if refund already requested
    const currentRefundStatus = (order as any).refundStatus ?? 'none'
    if (currentRefundStatus !== 'none') {
      return NextResponse.json({ error: 'Запрос на возврат уже отправлен' }, { status: 409 })
    }

    const { reason } = await req.json()

    await (prisma as any).$executeRawUnsafe(
      `UPDATE "Order" SET refundStatus = 'requested', refundReason = ?, refundRequestedAt = CURRENT_TIMESTAMP WHERE id = ?`,
      reason || null, orderId,
    )

    return NextResponse.json({ ok: true, message: 'Запрос на возврат отправлен. Куратор свяжется с вами.' })
  } catch (error) {
    console.error('refund request error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
