import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ ok: false }, { status: 401 })
    const userId = (session.user as any).id as string
    await ensureDb()
    await (prisma as any).$executeRawUnsafe(
      `UPDATE "User" SET "lastSeenAt" = CURRENT_TIMESTAMP WHERE "id" = ?`,
      userId,
    )
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false })
  }
}
