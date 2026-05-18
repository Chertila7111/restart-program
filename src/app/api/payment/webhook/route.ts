import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/mailer'
import { ensureDb } from '@/lib/db-init'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'crypto'

function genPassword() {
  // 10-char human-readable: letters + digits, no ambiguous chars
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from(randomBytes(10)).map(b => chars[b % chars.length]).join('')
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

        // Auto-create account if user doesn't exist yet
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
          // Link order to new user
          await prisma.order.update({ where: { id: orderId }, data: { userId: newUser.id } })
        } else if (!existing.userId) {
          // Link existing user to order if not yet linked
          await prisma.order.update({ where: { id: orderId }, data: { userId: existing.id } }).catch(() => {})
        }

        sendWelcomeEmail({
          to: order.email,
          name: order.name,
          product: order.product,
          productName: order.productName,
          tempPassword: tempPassword ?? undefined,
        }).catch(err => console.error('Email send failed:', err))
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
