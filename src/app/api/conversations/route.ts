import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { ensureDb } from '@/lib/db-init'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  try {
    await ensureDb()
    const userId = (session.user as any).id as string

    const members = await (prisma as any).conversationMember.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            members: { include: { user: { select: { id: true, name: true, email: true, role: true } } } },
            messages: { orderBy: { createdAt: 'desc' }, take: 1 },
          },
        },
      },
    })

    const convs = members.map((m: any) => {
      const conv = m.conversation
      const lastMsg = conv.messages[0] ?? null
      const otherMembers = conv.members
        .filter((cm: any) => cm.userId !== userId)
        .map((cm: any) => cm.user)

      return {
        id: conv.id,
        subject: conv.subject,
        lastMessage: lastMsg ? { text: lastMsg.text, createdAt: lastMsg.createdAt } : null,
        updatedAt: conv.updatedAt,
        participants: otherMembers,
      }
    })

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
