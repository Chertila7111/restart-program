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

    // Verify user is a member
    const member = await (prisma as any).conversationMember.findFirst({
      where: { conversationId, userId },
    })
    if (!member) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

    const messages = await (prisma as any).message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { id: true, name: true, email: true, role: true } } },
    })

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

    // Verify membership
    const member = await (prisma as any).conversationMember.findFirst({
      where: { conversationId, userId },
    })
    if (!member) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

    const msgId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const safe = text.trim().replace(/'/g, "''")

    await (prisma as any).$executeRawUnsafe(
      `INSERT INTO "Message" ("id","conversationId","senderId","text","createdAt") VALUES ('${msgId}', '${conversationId}', '${userId}', '${safe}', CURRENT_TIMESTAMP)`
    )
    await (prisma as any).$executeRawUnsafe(
      `UPDATE "Conversation" SET "updatedAt" = CURRENT_TIMESTAMP WHERE "id" = '${conversationId}'`
    )

    const msg = await (prisma as any).message.findUnique({
      where: { id: msgId },
      include: { sender: { select: { id: true, name: true, email: true, role: true } } },
    })

    return NextResponse.json(msg)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
