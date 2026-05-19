import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'

// GET — unread count or list
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ count: 0, items: [] })
    const userId = (session.user as any).id as string
    await ensureDb()
    const rows = await (prisma as any).$queryRawUnsafe(
      `SELECT id, type, title, body, relatedId, read, createdAt FROM "Notification"
       WHERE userId = ? ORDER BY createdAt DESC LIMIT 30`,
      userId,
    )
    const items = Array.isArray(rows) ? rows : []
    const count = items.filter((n: any) => !n.read).length
    return NextResponse.json({ count, items })
  } catch {
    return NextResponse.json({ count: 0, items: [] })
  }
}

// POST — mark all as read
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ ok: false }, { status: 401 })
    const userId = (session.user as any).id as string
    const body = await req.json().catch(() => ({}))
    await ensureDb()
    if (body.action === 'markRead') {
      await (prisma as any).$executeRawUnsafe(
        `UPDATE "Notification" SET read = 1 WHERE userId = ?`,
        userId,
      )
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
