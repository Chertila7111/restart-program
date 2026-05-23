import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!session?.user || (role !== 'psychologist' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const specialistId = (session.user as any).id as string
  const { userId, note, tags, isImportant } = await req.json()
  if (!userId || !note) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  try {
    await ensureDb()

    // BOLA guard: psychologist can only write notes about users in their groups
    if (role !== 'admin') {
      const membership = await (prisma as any).$queryRawUnsafe(`
        SELECT gp.id FROM "GroupParticipant" gp
        JOIN "Group" g ON g.id = gp.groupId
        WHERE gp.userId = ? AND g.psychologistId = ? AND gp.status = 'active'
        LIMIT 1
      `, userId, specialistId) as { id: string }[]
      if (!Array.isArray(membership) || membership.length === 0) {
        return NextResponse.json({ error: 'Forbidden: client not in your groups' }, { status: 403 })
      }
    }

    const id = `note-${Date.now()}-${Math.random().toString(36).slice(2)}`
    await (prisma as any).$executeRawUnsafe(
      `INSERT INTO "SpecialistNote" (id, specialistId, userId, note, tags, isImportant, createdAt) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      id, specialistId, userId, note, tags || null, isImportant ? 1 : 0
    )
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
