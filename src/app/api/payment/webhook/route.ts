import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/mailer'
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    if (body.event === 'payment.succeeded') {
      const paymentId = body.object?.id
      const orderId = body.object?.metadata?.orderId

      if (orderId) {
        await ensureDb()

        const order = await prisma.order.update({
          where: { id: orderId },
          data: { status: 'paid', paymentId },
        })

        let userId = order.userId ?? null
        let tempPassword: string | null = null
        const existing = await prisma.user.findUnique({ where: { email: order.email } })

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
        } else {
          userId = existing.id
          if (!order.userId) {
            await prisma.order.update({ where: { id: orderId }, data: { userId: existing.id } }).catch(() => {})
          }
        }

        sendWelcomeEmail({
          to: order.email,
          name: order.name,
          product: order.product,
          productName: order.productName,
          tempPassword: tempPassword ?? undefined,
        }).catch(err => console.error('Email send failed:', err))

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
