import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { ensureDb } from '@/lib/db-init'
import { prisma } from '@/lib/prisma'
import { logAudit } from '@/lib/audit'

const GROUP_MAX_SIZE = 12
const GROUP_WARN_SIZE = 8
const VALID_GROUP_STATUSES = ['recruiting', 'active', 'paused', 'completed'] as const

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const role = (session.user as any).role as string
  const curatorId = (session.user as any).id as string
  const { groupId } = await params

  try {
    await ensureDb()

    const groups = await (prisma as any).$queryRawUnsafe(`
      SELECT g.id, g.title, g.status, g.currentWeek, g.createdAt,
             g.curatorId, g.psychologistId, u.name as psychologistName
      FROM "Group" g
      LEFT JOIN "User" u ON u.id = g.psychologistId
      WHERE g.id = ? AND (? = 'admin' OR g.curatorId = ?)
      LIMIT 1
    `, groupId, role, curatorId)

    if (!Array.isArray(groups) || groups.length === 0) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }

    const participants = await (prisma as any).$queryRawUnsafe(`
      SELECT u.id, u.name, u.email, u.lastSeenAt, gp.joinedAt
      FROM "GroupParticipant" gp
      JOIN "User" u ON u.id = gp.userId
      WHERE gp.groupId = ? AND gp.status = 'active'
      ORDER BY gp.joinedAt ASC
    `, groupId)

    return NextResponse.json({
      group: groups[0],
      participants: Array.isArray(participants) ? participants : [],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const role = (session.user as any).role as string
  const actorId = (session.user as any).id as string
  const { groupId } = await params

  try {
    await ensureDb()

    const groups = await (prisma as any).$queryRawUnsafe(`
      SELECT id FROM "Group" WHERE id = ? AND (? = 'admin' OR curatorId = ?)
    `, groupId, role, actorId)

    if (!Array.isArray(groups) || groups.length === 0) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }

    const body = await req.json()
    const { action, userId, status, title, week } = body

    if (action === 'addMember') {
      if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

      // Capacity check
      const countRows = await (prisma as any).$queryRawUnsafe(
        `SELECT COUNT(*) as cnt FROM "GroupParticipant" WHERE groupId = ? AND status = 'active'`,
        groupId
      ) as { cnt: number }[]
      const currentCount = Number(countRows[0]?.cnt ?? 0)
      if (currentCount >= GROUP_MAX_SIZE) {
        return NextResponse.json(
          { error: `Группа заполнена (максимум ${GROUP_MAX_SIZE} участников)` },
          { status: 400 }
        )
      }

      const gpId = `gp-${groupId.slice(-6)}-${userId.slice(-6)}-${Date.now()}`
      await (prisma as any).$executeRawUnsafe(`
        INSERT OR IGNORE INTO "GroupParticipant" ("id","groupId","userId","status","joinedAt")
        VALUES (?, ?, ?, 'active', CURRENT_TIMESTAMP)
      `, gpId, groupId, userId)
      await (prisma as any).$executeRawUnsafe(`
        UPDATE "GroupParticipant" SET status = 'active' WHERE groupId = ? AND userId = ?
      `, groupId, userId)

      await logAudit({
        actorId, actorRole: role, action: 'add_to_group',
        targetUserId: userId, entityType: 'Group', entityId: groupId,
      })

      return NextResponse.json({ ok: true })
    }

    if (action === 'removeMember') {
      if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
      await (prisma as any).$executeRawUnsafe(`
        UPDATE "GroupParticipant" SET status = 'inactive' WHERE groupId = ? AND userId = ?
      `, groupId, userId)

      await logAudit({
        actorId, actorRole: role, action: 'remove_from_group',
        targetUserId: userId, entityType: 'Group', entityId: groupId,
      })

      return NextResponse.json({ ok: true })
    }

    if (action === 'setStatus') {
      if (!status) return NextResponse.json({ error: 'status required' }, { status: 400 })

      // Allowlist — prevent arbitrary string injection
      if (!(VALID_GROUP_STATUSES as readonly string[]).includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Allowed: ${VALID_GROUP_STATUSES.join(', ')}` },
          { status: 400 }
        )
      }

      if (status === 'active') {
        // Require psychologist assigned
        const groupInfo = await (prisma as any).$queryRawUnsafe(
          `SELECT psychologistId FROM "Group" WHERE id = ? LIMIT 1`, groupId
        ) as { psychologistId: string | null }[]
        if (!groupInfo[0]?.psychologistId) {
          return NextResponse.json(
            { error: 'Назначьте психолога перед стартом группы' },
            { status: 400 }
          )
        }

        // Require at least one meeting
        const meetingRows = await (prisma as any).$queryRawUnsafe(
          `SELECT COUNT(*) as cnt FROM "Meeting" WHERE groupId = ?`, groupId
        ) as { cnt: number }[]
        const meetingCount = Number(meetingRows[0]?.cnt ?? 0)
        if (meetingCount === 0) {
          return NextResponse.json(
            { error: 'Добавьте хотя бы одну встречу перед стартом группы' },
            { status: 400 }
          )
        }

        // Two-step confirmation if below recommended size
        const countRows = await (prisma as any).$queryRawUnsafe(
          `SELECT COUNT(*) as cnt FROM "GroupParticipant" WHERE groupId = ? AND status = 'active'`, groupId
        ) as { cnt: number }[]
        const participantCount = Number(countRows[0]?.cnt ?? 0)
        if (participantCount < GROUP_WARN_SIZE && !body.confirmSmallGroup) {
          return NextResponse.json({
            requiresConfirmation: true,
            participantCount,
            warning: `В группе ${participantCount} участников (рекомендуется не менее ${GROUP_WARN_SIZE}). Активировать группу?`,
          })
        }
      }

      await (prisma as any).$executeRawUnsafe(
        `UPDATE "Group" SET status = ? WHERE id = ?`, status, groupId
      )

      await logAudit({
        actorId, actorRole: role, action: 'set_group_status',
        entityType: 'Group', entityId: groupId, metadata: { status },
      })

      return NextResponse.json({ ok: true })
    }

    if (action === 'setWeek') {
      const w = Number(week)
      if (!w || w < 1 || w > 12) return NextResponse.json({ error: 'invalid week' }, { status: 400 })
      await (prisma as any).$executeRawUnsafe(
        `UPDATE "Group" SET currentWeek = ? WHERE id = ?`, w, groupId
      )
      return NextResponse.json({ ok: true })
    }

    if (action === 'rename') {
      if (!title?.trim()) return NextResponse.json({ error: 'title required' }, { status: 400 })
      await (prisma as any).$executeRawUnsafe(
        `UPDATE "Group" SET title = ? WHERE id = ?`, title.trim(), groupId
      )
      return NextResponse.json({ ok: true })
    }

    if (action === 'setPsychologist') {
      const { psychologistId } = body as { psychologistId: string | null }

      // Validate the target user actually has the psychologist role
      if (psychologistId) {
        const psych = await (prisma as any).$queryRawUnsafe(
          `SELECT id FROM "User" WHERE id = ? AND role = 'psychologist' LIMIT 1`, psychologistId
        ) as { id: string }[]
        if (!Array.isArray(psych) || psych.length === 0) {
          return NextResponse.json({ error: 'User is not a psychologist' }, { status: 400 })
        }
      }

      await (prisma as any).$executeRawUnsafe(
        `UPDATE "Group" SET psychologistId = ? WHERE id = ?`,
        psychologistId || null, groupId
      )
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'unknown action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const role = (session.user as any).role as string
  const actorId = (session.user as any).id as string
  const { groupId } = await params

  try {
    await ensureDb()

    const groups = await (prisma as any).$queryRawUnsafe(`
      SELECT id FROM "Group" WHERE id = ? AND (? = 'admin' OR curatorId = ?)
    `, groupId, role, actorId)

    if (!Array.isArray(groups) || groups.length === 0) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }

    await (prisma as any).$executeRawUnsafe(`DELETE FROM "Meeting" WHERE groupId = ?`, groupId)
    await (prisma as any).$executeRawUnsafe(`DELETE FROM "GroupParticipant" WHERE groupId = ?`, groupId)
    await (prisma as any).$executeRawUnsafe(`DELETE FROM "Group" WHERE id = ?`, groupId)

    await logAudit({
      actorId, actorRole: role, action: 'delete_group',
      entityType: 'Group', entityId: groupId,
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
