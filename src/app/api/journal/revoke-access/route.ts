import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/journal/revoke-access
// Revokes psychologist access to ALL shared journal entries for the current user
export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await (prisma as any).$executeRawUnsafe(
      `UPDATE "JournalEntry" SET sharedWithSpecialist = 0 WHERE userId = ?`,
      user.id,
    )

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('revoke-access error:', e)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
