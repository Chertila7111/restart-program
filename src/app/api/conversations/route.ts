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

    // Get all conversations this user is a member of
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

    // Sort by last message time
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

    // If no target, create a conversation with the doctor
    const doctorId = 'doctor-maria-sokolova'
    const otherUserId = targetUserId ?? doctorId

    // Check if conversation already exists between these two users
    const existing = await (prisma as any).conversationMember.findFirst({
      where: { userId },
      include: {
        conversation: {
          include: { members: { where: { userId: otherUserId } } },
        },
      },
    })

    const existingConv = existing?.conversation?.members?.length > 0
      ? existing.conversation
      : null

    if (existingConv) {
      return NextResponse.json({ id: existingConv.id, existing: true })
    }

    const convId = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const subjectText = subject ?? (role === 'admin' || role === 'psychologist' ? 'Личный чат' : 'Чат с психологом')

    await (prisma as any).$executeRawUnsafe(
      `INSERT INTO "Conversation" ("id","subject","createdAt","updatedAt") VALUES ('${convId}', '${subjectText.replace(/'/g, "''")}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`
    )
    await (prisma as any).$executeRawUnsafe(
      `INSERT INTO "ConversationMember" ("id","conversationId","userId") VALUES ('cm-${convId}-u1', '${convId}', '${userId}')`
    )
    await (prisma as any).$executeRawUnsafe(
      `INSERT OR IGNORE INTO "ConversationMember" ("id","conversationId","userId") VALUES ('cm-${convId}-u2', '${convId}', '${otherUserId}')`
    )

    return NextResponse.json({ id: convId, existing: false })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
