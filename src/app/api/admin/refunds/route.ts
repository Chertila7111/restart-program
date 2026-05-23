import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import { logAudit } from '@/lib/audit'

// GET /api/admin/refunds — list refund requests
// Admins see all. Curators see only users in their groups.
export async function GET() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role as string
  const actorId = (session?.user as any)?.id as string
  if (!session || !['admin', 'curator'].includes(role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    await ensureDb()

    let orders: Record<string, unknown>[]

    if (role === 'admin') {
      orders = await (prisma as any).$queryRawUnsafe(`
        SELECT o.id, o.email, o.name, o.product, o.productName, o.amount,
               o.paymentId, o.refundStatus, o.refundReason,
               o.refundRequestedAt, o.refundCompletedAt,
               o.createdAt, o.userId
        FROM "Order" o
        WHERE o.refundStatus != 'none'
        ORDER BY o.refundRequestedAt DESC
      `) as Record<string, unknown>[]
    } else {
      // Curator: only users in their groups
      orders = await (prisma as any).$queryRawUnsafe(`
        SELECT o.id, o.email, o.name, o.product, o.productName, o.amount,
               o.paymentId, o.refundStatus, o.refundReason,
               o.refundRequestedAt, o.refundCompletedAt,
               o.createdAt, o.userId
        FROM "Order" o
        WHERE o.refundStatus != 'none'
          AND o.userId IN (
            SELECT gp.userId FROM "GroupParticipant" gp
            JOIN "Group" g ON g.id = gp.groupId
            WHERE g.curatorId = ? AND gp.status = 'active'
          )
        ORDER BY o.refundRequestedAt DESC
      `, actorId) as Record<string, unknown>[]
    }

    return NextResponse.json({ refunds: Array.isArray(orders) ? orders : [] })
  } catch {
    return NextResponse.json({ refunds: [] }, { status: 500 })
  }
}

async function tryYooKassaRefund(
  paymentId: string,
  amountKopeks: number,
  idempotenceKey: string,
): Promise<{ ok: boolean; yooId?: string; error?: string }> {
  const shopId = process.env.YOOKASSA_SHOP_ID
  const secretKey = process.env.YOOKASSA_SECRET_KEY
  if (!shopId || !secretKey) return { ok: false, error: 'no_keys' }

  try {
    const res = await fetch('https://api.yookassa.ru/v3/refunds', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': idempotenceKey,
        Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`,
      },
      body: JSON.stringify({
        payment_id: paymentId,
        amount: {
          value: (amountKopeks / 100).toFixed(2),
          currency: 'RUB',
        },
        description: 'Возврат по запросу клиента',
      }),
    })
    const data = await res.json()
    if (res.ok && (data.status === 'succeeded' || data.status === 'pending')) {
      return { ok: true, yooId: data.id }
    }
    return { ok: false, error: data.description ?? 'yookassa_error' }
  } catch (e) {
    return { ok: false, error: String(e) }
  }
}

// PATCH /api/admin/refunds — process a refund request
// Body: { orderId, action: 'approve' | 'decline', refundAmount? }
// NOTE: approve attempts automatic refund via YooKassa if YOOKASSA_* env vars are set.
//       If keys are absent or the payment has no paymentId, refund is marked MANUAL —
//       admin must process it in the YooKassa dashboard manually.
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role as string
  const actorId = (session?.user as any)?.id as string
  if (!session || role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    await ensureDb()

    const { orderId, action, refundAmount } = await req.json()
    if (!orderId || !action) return NextResponse.json({ error: 'orderId and action required' }, { status: 400 })

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    // Idempotency guard — prevent double-refund
    const currentRefundStatus = (order as any).refundStatus ?? 'none'
    if (action === 'approve' && currentRefundStatus === 'approved') {
      return NextResponse.json({ error: 'Refund already approved', idempotent: true }, { status: 409 })
    }

    if (action === 'approve') {
      const amount: number = refundAmount ?? (order as any).amount ?? 0
      const orderAmount: number = (order as any).amount ?? 0

      // Validate amount — cannot refund more than was paid
      if (amount > orderAmount) {
        return NextResponse.json({
          error: `Сумма возврата (${amount}) превышает сумму заказа (${orderAmount})`,
        }, { status: 422 })
      }

      const paymentId: string | null = (order as any).paymentId ?? null
      let refundMode: 'auto' | 'manual' = 'manual'
      let yooRefundId: string | undefined

      if (paymentId) {
        const result = await tryYooKassaRefund(paymentId, amount, `refund-${orderId}`)
        if (result.ok) {
          refundMode = 'auto'
          yooRefundId = result.yooId
        } else if (result.error !== 'no_keys') {
          console.warn('[refund] YooKassa refund failed:', result.error)
          // Fall through to manual — don't block admin action
        }
      }

      await (prisma as any).$executeRawUnsafe(
        `UPDATE "Order"
         SET refundStatus = 'approved', refundAmount = ?, refundCompletedAt = CURRENT_TIMESTAMP
         WHERE id = ?`,
        amount, orderId,
      )

      await logAudit({
        actorId, actorRole: role, action: 'refund_approved',
        targetUserId: order.userId ?? undefined, entityType: 'Order', entityId: orderId,
        metadata: { refundAmount: amount, refundMode, yooRefundId },
      })

      return NextResponse.json({
        ok: true,
        refundMode,
        // Explicit note when manual so admin knows what to do
        ...(refundMode === 'manual' && {
          note: 'Возврат помечен как одобренный. Выполните возврат вручную в личном кабинете ЮKassa.',
        }),
      })

    } else if (action === 'decline') {
      await (prisma as any).$executeRawUnsafe(
        `UPDATE "Order" SET refundStatus = 'declined', refundCompletedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        orderId,
      )
      await logAudit({
        actorId, actorRole: role, action: 'refund_declined',
        targetUserId: order.userId ?? undefined, entityType: 'Order', entityId: orderId,
      })
      return NextResponse.json({ ok: true })

    } else {
      return NextResponse.json({ error: 'action must be approve or decline' }, { status: 400 })
    }
  } catch (error) {
    console.error('admin refunds PATCH error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
