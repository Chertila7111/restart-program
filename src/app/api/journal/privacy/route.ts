import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'

const ALLOWED = ['private', 'specialist']

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { access } = await req.json() as { access: string }
  if (!ALLOWED.includes(access)) return NextResponse.json({ error: 'Invalid access value' }, { status: 400 })

  try {
    await ensureDb()
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const id = `up-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    await (prisma as any).$executeRawUnsafe(
      `INSERT INTO "UserProfile" (id, userId, diaryAccess, createdAt, updatedAt)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT(userId) DO UPDATE SET diaryAccess = excluded.diaryAccess, updatedAt = CURRENT_TIMESTAMP`,
      id, user.id, access
    )

    // If switching to private — also unshare all entries
    if (access === 'private') {
      await (prisma as any).$executeRawUnsafe(
        `UPDATE "JournalEntry" SET sharedWithSpecialist = 0 WHERE userId = ?`,
        user.id
      )
    }

    return NextResponse.json({ ok: true, access })
  } catch (e) {
    console.error('[privacy]', e)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
