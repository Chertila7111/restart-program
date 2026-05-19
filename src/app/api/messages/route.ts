import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { ensureDb } from '@/lib/db-init'
import { prisma } from '@/lib/prisma'

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

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const userId = (session.user as any).id as string

  try {
    await ensureDb()
    const body = await req.json()
    const { conversationId, text } = body as { conversationId: string; text: string }

    if (!conversationId || !text?.trim()) {
      return NextResponse.json({ error: 'conversationId and text required' }, { status: 400 })
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
    return NextResponse.json({
      id: m.id,
      text: m.text,
      conversationId: m.conversationId,
      createdAt: m.createdAt,
      sender: { id: m.sender_id, name: m.sender_name, email: m.sender_email, role: m.sender_role },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
