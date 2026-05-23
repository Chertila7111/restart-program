import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { ensureDb } from '@/lib/db-init'
import { prisma } from '@/lib/prisma'
import webpush from 'web-push'
import { checkRateLimit } from '@/lib/rate-limit'

const MESSAGE_MAX_LENGTH = 4000

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const userId = (session.user as any).id as string
  const { searchParams } = new URL(req.url)
  const conversationId = searchParams.get('conversationId')
  if (!conversationId) return NextResponse.json({ error: 'conversationId required' }, { status: 400 })

  try {
    await ensureDb()

    // ConversationMember is not in Prisma schema — use raw SQL
    const members = await (prisma as any).$queryRawUnsafe(
      `SELECT id FROM "ConversationMember" WHERE "conversationId" = ? AND "userId" = ? LIMIT 1`,
      conversationId, userId
    )
    if (!Array.isArray(members) || members.length === 0) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    // Message is not in Prisma schema — use raw SQL
    const rows = await (prisma as any).$queryRawUnsafe(`
      SELECT m.id, m.text, m."conversationId", m."senderId", m."createdAt",
             u.id   AS sender_id,
             u.name AS sender_name,
             u.email AS sender_email,
             u.role  AS sender_role
      FROM "Message" m
      JOIN "User" u ON u.id = m."senderId"
      WHERE m."conversationId" = ?
      ORDER BY m."createdAt" ASC
    `, conversationId)

    const messages = (Array.isArray(rows) ? rows : []).map((m: any) => ({
      id: m.id,
      text: m.text,
      conversationId: m.conversationId,
      createdAt: m.createdAt,
      sender: { id: m.sender_id, name: m.sender_name, email: m.sender_email, role: m.sender_role },
    }))

    return NextResponse.json(messages)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const userId = (session.user as any).id as string
  const { searchParams } = new URL(req.url)
  const messageId = searchParams.get('id')

  if (!messageId) return NextResponse.json({ error: 'id required' }, { status: 400 })

  try {
    await ensureDb()

    const msgs = await (prisma as any).$queryRawUnsafe(
      `SELECT id FROM "Message" WHERE id = ? AND senderId = ? LIMIT 1`,
      messageId, userId
    )
    if (!Array.isArray(msgs) || msgs.length === 0) {
      return NextResponse.json({ error: 'not found or forbidden' }, { status: 403 })
    }

    await (prisma as any).$executeRawUnsafe(`DELETE FROM "Message" WHERE id = ?`, messageId)
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const userId = (session.user as any).id as string

  const rl = checkRateLimit(`msg:${userId}`, 30, 60_000)
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Слишком много сообщений. Подождите немного.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  try {
    await ensureDb()
    const body = await req.json()
    const { conversationId, text } = body as { conversationId: string; text: string }

    if (!conversationId || !text?.trim()) {
      return NextResponse.json({ error: 'conversationId and text required' }, { status: 400 })
    }
    if (text.length > MESSAGE_MAX_LENGTH) {
      return NextResponse.json({ error: `Сообщение слишком длинное (максимум ${MESSAGE_MAX_LENGTH} символов)` }, { status: 400 })
    }

    // Ensure sender exists in DB (admin logs in via env vars and may not have a DB record)
    await (prisma as any).$executeRawUnsafe(
      `INSERT OR IGNORE INTO "User" ("id","email","name","role","createdAt","updatedAt") VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      userId,
      session.user.email,
      session.user.name ?? session.user.email,
      (session.user as any).role ?? 'user'
    )

    // Verify membership — ConversationMember not in Prisma schema
    const members = await (prisma as any).$queryRawUnsafe(
      `SELECT id FROM "ConversationMember" WHERE "conversationId" = ? AND "userId" = ? LIMIT 1`,
      conversationId, userId
    )
    if (!Array.isArray(members) || members.length === 0) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    const msgId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

    await (prisma as any).$executeRawUnsafe(
      `INSERT INTO "Message" ("id","conversationId","senderId","text","createdAt") VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      msgId, conversationId, userId, text.trim()
    )
    await (prisma as any).$executeRawUnsafe(
      `UPDATE "Conversation" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = ?`,
      conversationId
    )

    // Fetch the created message — Message not in Prisma schema
    const rows = await (prisma as any).$queryRawUnsafe(`
      SELECT m.id, m.text, m."conversationId", m."senderId", m."createdAt",
             u.id   AS sender_id,
             u.name AS sender_name,
             u.email AS sender_email,
             u.role  AS sender_role
      FROM "Message" m
      JOIN "User" u ON u.id = m."senderId"
      WHERE m.id = ?
    `, msgId)

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: 'message not found after insert' }, { status: 500 })
    }

    const m = rows[0]
    const result = {
      id: m.id,
      text: m.text,
      conversationId: m.conversationId,
      createdAt: m.createdAt,
      sender: { id: m.sender_id, name: m.sender_name, email: m.sender_email, role: m.sender_role },
    }

    // Send push to other conversation members (non-blocking)
    ;(async () => {
      try {
        if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) return
        webpush.setVapidDetails(
          process.env.VAPID_EMAIL || 'mailto:support@snova-s-soboy.ru',
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          process.env.VAPID_PRIVATE_KEY
        )
        const subs = (await (prisma as any).$queryRawUnsafe(`
          SELECT ps.endpoint, ps.p256dh, ps.auth
          FROM "PushSubscription" ps
          WHERE ps.userId IN (
            SELECT userId FROM "ConversationMember"
            WHERE conversationId = ? AND userId != ?
          )
        `, conversationId, userId)) as { endpoint: string; p256dh: string; auth: string }[]

        const senderName = session.user?.name ?? session.user?.email ?? 'Собеседник'
        const body = text.trim().length > 80 ? text.trim().slice(0, 77) + '…' : text.trim()
        const payload = JSON.stringify({
          title: `Новое сообщение от ${senderName}`,
          body,
          tag: `chat-${conversationId}`,
          url: '/dashboard/chats',
        })
        for (const sub of subs) {
          webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload
          ).catch(() => {})
        }
      } catch {}
    })()

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
