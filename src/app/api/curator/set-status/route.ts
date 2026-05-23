import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import { logAudit } from '@/lib/audit'

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  lead:             ['intro_paid', 'waiting_group', 'in_group'],
  intro_paid:       ['intro_scheduled', 'intro_completed', 'waiting_group'],
  intro_scheduled:  ['intro_paid', 'intro_completed', 'waiting_group'],  // allow undo if date cancelled
  intro_completed:  ['intro_scheduled', 'waiting_group', 'in_group'],    // allow undo if mistake
  waiting_group:    ['in_group'],
  in_group:         ['completed', 'waiting_group'],
  individual:       ['completed'],
  completed:        [],
}

// Statuses reachable during intro flow (before group assignment)
const INTRO_STATUSES = new Set(['lead', 'intro_paid', 'intro_scheduled', 'intro_completed'])
const INTRO_TARGETS  = new Set(['intro_paid', 'intro_scheduled', 'intro_completed', 'waiting_group'])

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const role = (session?.user as any)?.role as string
    const actorId = (session?.user as any)?.id as string
    if (!session || !['curator', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { userId, status } = await req.json()
    if (!userId || !status) {
      return NextResponse.json({ error: 'userId and status required' }, { status: 400 })
    }

    await ensureDb()

    // Fetch current user state first — needed for BOLA logic and transition validation
    const userRows = await (prisma as any).$queryRawUnsafe(
      `SELECT status, tier FROM "User" WHERE id = ? LIMIT 1`, userId
    ) as { status: string; tier: string }[]

    if (!userRows[0]) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const currentStatus = userRows[0].status ?? 'lead'
    const currentTier   = userRows[0].tier   ?? 'none'

    // BOLA guard for curators
    if (role !== 'admin') {
      const owned = await (prisma as any).$queryRawUnsafe(`
        SELECT gp.id FROM "GroupParticipant" gp
        JOIN "Group" g ON g.id = gp.groupId
        WHERE gp.userId = ? AND g.curatorId = ?
        LIMIT 1
      `, userId, actorId) as { id: string }[]

      const hasGroupOwnership = Array.isArray(owned) && owned.length > 0

      if (!hasGroupOwnership) {
        // Intro-stage exception: user hasn't joined a group yet (pre-course flow).
        // Any curator may manage intro transitions — formal assignment happens later.
        const isIntroStage = currentTier === 'intro' && INTRO_STATUSES.has(currentStatus)
        if (!isIntroStage) {
          return NextResponse.json({ error: 'Forbidden: user not in your groups' }, { status: 403 })
        }
        // Curators without group ownership may only set intro-related targets
        if (!INTRO_TARGETS.has(status)) {
          return NextResponse.json({ error: 'Forbidden: can only manage intro transitions' }, { status: 403 })
        }
      }
    }

    const allowed = ALLOWED_TRANSITIONS[currentStatus] ?? []

    // Admin can set any status; curators are restricted to allowed transitions
    if (role !== 'admin' && !allowed.includes(status)) {
      return NextResponse.json(
        { error: `Cannot transition from ${currentStatus} to ${status}` },
        { status: 422 }
      )
    }

    await (prisma as any).$executeRawUnsafe(
      `UPDATE "User" SET status = ? WHERE id = ?`, status, userId
    )

    // When setting in_group: auto-set tier to at least 'base' if still 'intro'
    if (status === 'in_group') {
      await (prisma as any).$executeRawUnsafe(`
        UPDATE "User" SET tier = 'base'
        WHERE id = ? AND (tier = 'none' OR tier = 'intro')
      `, userId)
    }

    await logAudit({
      actorId,
      actorRole: role,
      action: 'set_status',
      targetUserId: userId,
      entityType: 'User',
      entityId: userId,
      metadata: { from: currentStatus, to: status },
    })

    return NextResponse.json({ ok: true, status })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
