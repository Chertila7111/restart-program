import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import { logAudit } from '@/lib/audit'

// GET /api/specialist/journal?userId=xxx
// Returns shared journal entries for a client who is in one of this psychologist's groups
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role as string
  if (!session?.user || (role !== 'psychologist' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const specialistId = (session.user as any).id as string
  const { searchParams } = new URL(req.url)
  const clientId = searchParams.get('userId')
  if (!clientId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

  try {
    await ensureDb()

    // Ownership check: client must be in one of this psychologist's groups (or admin bypasses)
    if (role !== 'admin') {
      const membership = await (prisma as any).$queryRawUnsafe(`
        SELECT gp.id FROM "GroupParticipant" gp
        JOIN "Group" g ON g.id = gp.groupId
        WHERE gp.userId = ? AND g.psychologistId = ? AND gp.status = 'active'
        LIMIT 1
      `, clientId, specialistId) as { id: string }[]

      if (!Array.isArray(membership) || membership.length === 0) {
        return NextResponse.json({ error: 'Client not in your groups' }, { status: 403 })
      }
    }

    // Only return entries explicitly shared with specialist
    const entries = await (prisma as any).$queryRawUnsafe(`
      SELECT id, date, type, mood, anxiety, energy, sleep,
             triggers, helpers, note, nextStep, createdAt
      FROM "JournalEntry"
      WHERE userId = ? AND sharedWithSpecialist = 1
      ORDER BY createdAt DESC
      LIMIT 50
    `, clientId) as Record<string, unknown>[]

    // Log once per explicit fetch — not per re-render; client-side debounce is caller's responsibility
    await logAudit({
      actorId: specialistId,
      actorRole: role,
      action: 'view_client_journal',
      targetUserId: clientId,
      entityType: 'JournalEntry',
      metadata: { entriesCount: entries.length },
    })

    return NextResponse.json({ entries: Array.isArray(entries) ? entries : [] })
  } catch (err) {
    console.error('specialist journal error:', err)
    return NextResponse.json({ entries: [] }, { status: 500 })
  }
}
