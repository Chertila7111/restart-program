import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail, sendIntroPrepEmail } from '@/lib/mailer'
import { ensureDb } from '@/lib/db-init'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

function genPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from(randomBytes(10)).map(b => chars[b % chars.length]).join('')
}

function cuid() {
  return 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

async function notifyCurators(userId: string, userName: string, productName: string) {
  try {
    // Find curators of groups this user belongs to
    const curators = await (prisma as any).$queryRawUnsafe(`
      SELECT DISTINCT g.curatorId
      FROM "GroupParticipant" gp
      JOIN "Group" g ON g.id = gp.groupId
      WHERE gp.userId = ? AND g.curatorId IS NOT NULL AND g.curatorId != ''
    `, userId)

    const curatorIds: string[] = Array.isArray(curators)
      ? curators.map((r: any) => r.curatorId).filter(Boolean)
      : []

    // Also notify all users with curator role
    const allCurators = await (prisma as any).$queryRawUnsafe(
      `SELECT id FROM "User" WHERE role = 'curator'`,
    )
    const allCuratorIds: string[] = Array.isArray(allCurators)
      ? allCurators.map((r: any) => r.id)
      : []

    const recipients = [...new Set([...curatorIds, ...allCuratorIds])]

    for (const curatorId of recipients) {
      await (prisma as any).$executeRawUnsafe(`
        INSERT INTO "Notification" (id, userId, type, title, body, relatedId, read, createdAt)
        VALUES (?, ?, 'payment', ?, ?, ?, 0, CURRENT_TIMESTAMP)
      `,
        cuid(), curatorId,
        `Новый платёж: ${userName}`,
        `Участник оплатил тариф «${productName}». Свяжитесь с ним.`,
        userId,
      )
    }
  } catch (e) {
    console.error('[webhook] notifyCurators error:', e)
  }
}

// Product → tier mapping
const PRODUCT_TIER: Record<string, string> = {
  intro: 'intro',
  base: 'base',
  plus: 'plus',
  personal: 'personal',
}

async function verifyPaymentWithYooKassa(paymentId: string): Promise<boolean> {
  const shopId = process.env.YOOKASSA_SHOP_ID
  const secretKey = process.env.YOOKASSA_SECRET_KEY
  if (!shopId || !secretKey) return true // dev fallback: trust webhook without keys
  try {
    const res = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString('base64')}`,
      },
    })
    if (!res.ok) return false
    const data = await res.json()
    return data.status === 'succeeded'
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.event === 'payment.succeeded') {
      const paymentId = body.object?.id
      const orderId = body.object?.metadata?.orderId

      if (!paymentId || !orderId) {
        return NextResponse.json({ ok: true }) // ignore malformed
      }

      // Re-verify payment status directly with YooKassa — prevents fake webhooks
      const verified = await verifyPaymentWithYooKassa(paymentId)
      if (!verified) {
        console.warn('[webhook] Payment verification failed for', paymentId)
        return NextResponse.json({ error: 'Payment not verified' }, { status: 400 })
      }

      if (orderId) {
        await ensureDb()

        // Idempotency guard: if already processed, skip (prevents duplicate emails on YooKassa retries)
        const existingOrder = await prisma.order.findUnique({ where: { id: orderId } })
        if (!existingOrder) return NextResponse.json({ ok: true })
        if (existingOrder.status !== 'pending') return NextResponse.json({ ok: true })

        const order = await prisma.order.update({
          where: { id: orderId },
          data: { status: 'paid', paymentId },
        })

        let userId = order.userId ?? null
        let tempPassword: string | null = null
        const existing = await prisma.user.findUnique({ where: { email: order.email } })
        const newTier = PRODUCT_TIER[order.product] ?? null

        // Map tier → journey status
        const TIER_STATUS: Record<string, string> = {
          intro: 'intro_paid',
          base: 'waiting_group',
          plus: 'waiting_group',
          personal: 'waiting_group',
        }
        const newStatus = newTier ? (TIER_STATUS[newTier] ?? null) : null

        if (!existing) {
          tempPassword = genPassword()
          const hash = await bcrypt.hash(tempPassword, 12)
          const newUser = await prisma.user.create({
            data: {
              email: order.email,
              name: order.name,
              passwordHash: hash,
              role: 'user',
            },
          })
          userId = newUser.id
          await prisma.order.update({ where: { id: orderId }, data: { userId: newUser.id } })
          // Set tier + status on new user
          if (newTier) {
            await (prisma as any).$executeRawUnsafe(
              `UPDATE "User" SET tier = ?, status = ? WHERE id = ?`,
              newTier, newStatus ?? 'lead', userId
            )
          }
        } else {
          userId = existing.id
          if (!order.userId) {
            await prisma.order.update({ where: { id: orderId }, data: { userId: existing.id } }).catch(() => {})
          }
          // Status ranks — journey only advances, never regresses
          // in_group (5) must not be overwritten by waiting_group (4) on tier upgrade
          const STATUS_RANK: Record<string, number> = {
            lead: 0, intro_paid: 1, intro_scheduled: 2, intro_completed: 3,
            waiting_group: 4, in_group: 5, individual: 5, completed: 6,
          }
          const tierRank: Record<string, number> = { none: 0, intro: 1, base: 2, plus: 3, personal: 4 }
          const existingTier    = (existing as any).tier   ?? 'none'
          const currentStatus   = (existing as any).status ?? 'lead'

          if (newTier && (tierRank[newTier] ?? 0) > (tierRank[existingTier] ?? 0)) {
            // Only advance status — never push it backwards
            const currentRank = STATUS_RANK[currentStatus] ?? 0
            const newRank     = STATUS_RANK[newStatus ?? 'lead'] ?? 0
            const statusToSet = newRank > currentRank ? newStatus : currentStatus
            await (prisma as any).$executeRawUnsafe(
              `UPDATE "User" SET tier = ?, status = ? WHERE id = ?`,
              newTier, statusToSet ?? currentStatus, userId
            )
          }
        }

        const emailResult = await sendWelcomeEmail({
          to: order.email,
          name: order.name,
          product: order.product,
          productName: order.productName,
          tempPassword: tempPassword ?? undefined,
        }).catch(async (err) => {
          const maskedEmail = order.email.replace(/(.{2})[^@]*@/, '$1***@')
          console.error('[webhook] Email send failed for', maskedEmail, err)
          // Mark so admin sees email wasn't sent
          await prisma.order.update({ where: { id: orderId }, data: { status: 'paid_email_failed' } }).catch(() => {})
          return null
        })
        if (!emailResult) {
          const maskedEmail = order.email.replace(/(.{2})[^@]*@/, '$1***@')
          console.error('[webhook] Welcome email not delivered for', maskedEmail)
        }

        // Send prep email for intro buyers
        if (order.product === 'intro') {
          sendIntroPrepEmail({ to: order.email, name: order.name }).catch(() => {})
        }

        // Notify curators
        if (userId) {
          await notifyCurators(userId, order.name, order.productName)
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
