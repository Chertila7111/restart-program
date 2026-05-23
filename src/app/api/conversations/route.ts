import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { ensureDb } from '@/lib/db-init'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  try {
    await ensureDb()
    const userId = (session.user as any).id as string

    // All conversations this user belongs to, with every member's info
    const rows = await (prisma as any).$queryRawUnsafe(`
      SELECT c.id, c.subject, c.updatedAt,
             u.id as pId, u.name as pName, u.email as pEmail, u.role as pRole, u.lastSeenAt as pLastSeen
      FROM "Conversation" c
      JOIN "ConversationMember" cm ON cm.conversationId = c.id
      JOIN "User" u ON u.id = cm.userId
      WHERE c.id IN (SELECT conversationId FROM "ConversationMember" WHERE userId = ?)
      ORDER BY c.updatedAt DESC, c.id, u.id
    `, userId)

    // Last message per conversation
    const lastMsgRows = await (prisma as any).$queryRawUnsafe(`
      SELECT m.conversationId, m.text, m.createdAt
      FROM "Message" m
      INNER JOIN (
        SELECT conversationId, MAX(createdAt) as mc
        FROM "Message"
        WHERE conversationId IN (SELECT conversationId FROM "ConversationMember" WHERE userId = ?)
        GROUP BY conversationId
      ) latest ON m.conversationId = latest.conversationId AND m.createdAt = latest.mc
      GROUP BY m.conversationId
    `, userId)

    const lastMsgMap: Record<string, { text: string; createdAt: string }> = {}
    for (const r of (Array.isArray(lastMsgRows) ? lastMsgRows : [])) {
      lastMsgMap[r.conversationId] = { text: r.text, createdAt: r.createdAt }
    }

    // Group rows by conversation
    const convMap: Record<string, any> = {}
    for (const r of (Array.isArray(rows) ? rows : [])) {
      if (!convMap[r.id]) {
        convMap[r.id] = { id: r.id, subject: r.subject, updatedAt: r.updatedAt, participants: [] }
      }
      if (r.pId !== userId) {
        convMap[r.id].participants.push({
          id: r.pId, name: r.pName, email: r.pEmail, role: r.pRole, lastSeenAt: r.pLastSeen ?? null,
        })
      }
    }

    const convs = Object.values(convMap).map((c: any) => ({
      ...c,
      lastMessage: lastMsgMap[c.id] ?? null,
    }))

    convs.sort((a: any, b: any) => {
      const ta = a.lastMessage?.createdAt ?? a.updatedAt
      const tb = b.lastMessage?.createdAt ?? b.updatedAt
      return new Date(tb).getTime() - new Date(ta).getTime()
    })

    return NextResponse.json(convs)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const role = (session.user as any).role as string
  const userId = (session.user as any).id as string

  const rl = checkRateLimit(`conv:${userId}`, 5, 10 * 60_000)
  if (!rl.ok) {
    return NextResponse.json(
      { error: 'Слишком много запросов.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } },
    )
  }

  try {
    await ensureDb()
    const body = await req.json()
    const { targetUserId, subject } = body as { targetUserId?: string; subject?: string }

    // Ensure the current user exists in DB (admin logs in via env vars, no DB record by default)
    await (prisma as any).$executeRawUnsafe(
      `INSERT OR IGNORE INTO "User" ("id","email","name","role","createdAt","updatedAt") VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      userId,
      session.user.email,
      session.user.name ?? session.user.email,
      role ?? 'user'
    )

    const doctorId = 'doctor-maria-sokolova'
    const otherUserId = targetUserId ?? doctorId

    // Regular users can only open chats with staff (curator/psychologist/admin)
    if (role === 'user' && targetUserId) {
      const target = await (prisma as any).$queryRawUnsafe(
        `SELECT role FROM "User" WHERE id = ? LIMIT 1`, targetUserId
      ) as { role: string }[]
      const targetRole = target[0]?.role
      if (!targetRole || !['curator', 'psychologist', 'admin'].includes(targetRole)) {
        return NextResponse.json({ error: 'Forbidden: can only message staff' }, { status: 403 })
      }
    }

    // Check if a conversation already exists between these two users (raw SQL — ConversationMember is not in Prisma schema)
    const existingRows = await (prisma as any).$queryRawUnsafe(`
      SELECT cm1.conversationId FROM "ConversationMember" cm1
      WHERE cm1.userId = ?
        AND EXISTS (
          SELECT 1 FROM "ConversationMember" cm2
          WHERE cm2.conversationId = cm1.conversationId AND cm2.userId = ?
        )
      LIMIT 1
    `, userId, otherUserId)

    const existingConvId = Array.isArray(existingRows) && existingRows[0]
      ? existingRows[0].conversationId
      : null

    if (existingConvId) {
      return NextResponse.json({ id: existingConvId, existing: true })
    }

    const convId = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const subjectText = subject ?? 'Чат с психологом'

    await (prisma as any).$executeRawUnsafe(
      `INSERT INTO "Conversation" ("id","subject","createdAt","updatedAt") VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      convId, subjectText
    )
    await (prisma as any).$executeRawUnsafe(
      `INSERT OR IGNORE INTO "ConversationMember" ("id","conversationId","userId") VALUES (?, ?, ?)`,
      `cm-${convId}-u1`, convId, userId
    )
    await (prisma as any).$executeRawUnsafe(
      `INSERT OR IGNORE INTO "ConversationMember" ("id","conversationId","userId") VALUES (?, ?, ?)`,
      `cm-${convId}-u2`, convId, otherUserId
    )

    return NextResponse.json({ id: convId, existing: false })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
