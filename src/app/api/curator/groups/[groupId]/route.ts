import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { ensureDb } from '@/lib/db-init'
import { prisma } from '@/lib/prisma'

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
  const curatorId = (session.user as any).id as string
  const { groupId } = await params

  try {
    await ensureDb()

    const groups = await (prisma as any).$queryRawUnsafe(`
      SELECT id FROM "Group" WHERE id = ? AND (? = 'admin' OR curatorId = ?)
    `, groupId, role, curatorId)

    if (!Array.isArray(groups) || groups.length === 0) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }

    const body = await req.json()
    const { action, userId, status, title, week } = body

    if (action === 'addMember') {
      if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
      const gpId = `gp-${groupId.slice(-6)}-${userId.slice(-6)}-${Date.now()}`
      await (prisma as any).$executeRawUnsafe(`
        INSERT OR IGNORE INTO "GroupParticipant" ("id","groupId","userId","status","joinedAt")
        VALUES (?, ?, ?, 'active', CURRENT_TIMESTAMP)
      `, gpId, groupId, userId)
      await (prisma as any).$executeRawUnsafe(`
        UPDATE "GroupParticipant" SET status = 'active' WHERE groupId = ? AND userId = ?
      `, groupId, userId)
      return NextResponse.json({ ok: true })
    }

    if (action === 'removeMember') {
      if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })
      await (prisma as any).$executeRawUnsafe(`
        UPDATE "GroupParticipant" SET status = 'inactive' WHERE groupId = ? AND userId = ?
      `, groupId, userId)
      return NextResponse.json({ ok: true })
    }

    if (action === 'setStatus') {
      if (!status) return NextResponse.json({ error: 'status required' }, { status: 400 })
      await (prisma as any).$executeRawUnsafe(
        `UPDATE "Group" SET status = ? WHERE id = ?`, status, groupId
      )
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
  const curatorId = (session.user as any).id as string
  const { groupId } = await params

  try {
    await ensureDb()

    const groups = await (prisma as any).$queryRawUnsafe(`
      SELECT id FROM "Group" WHERE id = ? AND (? = 'admin' OR curatorId = ?)
    `, groupId, role, curatorId)

    if (!Array.isArray(groups) || groups.length === 0) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }

    await (prisma as any).$executeRawUnsafe(`DELETE FROM "Meeting" WHERE groupId = ?`, groupId)
    await (prisma as any).$executeRawUnsafe(`DELETE FROM "GroupParticipant" WHERE groupId = ?`, groupId)
    await (prisma as any).$executeRawUnsafe(`DELETE FROM "Group" WHERE id = ?`, groupId)

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
