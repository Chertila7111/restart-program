import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { ensureDb } from '@/lib/db-init'
import { prisma } from '@/lib/prisma'

async function authorizeGroup(groupId: string, curatorId: string, role: string) {
  const rows = await (prisma as any).$queryRawUnsafe(`
    SELECT id FROM "Group" WHERE id = ? AND (? = 'admin' OR curatorId = ?)
  `, groupId, role, curatorId)
  return Array.isArray(rows) && rows.length > 0
}

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
    if (!(await authorizeGroup(groupId, curatorId, role))) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }

    const meetings = await (prisma as any).$queryRawUnsafe(`
      SELECT id, type, title, description, date, time, duration, meetingLink, recordingUrl,
             status, groupId, participantId, curatorId, createdAt
      FROM "Meeting"
      WHERE groupId = ?
      ORDER BY date ASC, time ASC
    `, groupId)

    return NextResponse.json(Array.isArray(meetings) ? meetings : [])
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}

export async function POST(
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
    if (!(await authorizeGroup(groupId, curatorId, role))) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }

    const body = await req.json()
    const { type, title, date, time, duration, meetingLink, description, participantId } = body

    if (!title?.trim() || !date || !time) {
      return NextResponse.json({ error: 'title, date and time are required' }, { status: 400 })
    }

    const id = `meet-${groupId.slice(-6)}-${Date.now()}`
    await (prisma as any).$executeRawUnsafe(`
      INSERT INTO "Meeting" (
        "id","type","title","description","date","time","duration",
        "meetingLink","status","groupId","participantId","curatorId","createdBy","createdAt","updatedAt"
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `,
      id,
      type ?? 'group',
      title.trim(),
      description ?? null,
      date,
      time,
      duration ?? '90 мин',
      meetingLink ?? null,
      groupId,
      participantId ?? null,
      curatorId,
      curatorId
    )

    return NextResponse.json({ id, ok: true })
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
    if (!(await authorizeGroup(groupId, curatorId, role))) {
      return NextResponse.json({ error: 'not found' }, { status: 404 })
    }

    const body = await req.json()
    const { meetingId, action, status, recordingUrl, meetingLink, title, date, time } = body

    if (!meetingId) return NextResponse.json({ error: 'meetingId required' }, { status: 400 })

    if (action === 'setStatus') {
      if (!status) return NextResponse.json({ error: 'status required' }, { status: 400 })
      await (prisma as any).$executeRawUnsafe(
        `UPDATE "Meeting" SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND groupId = ?`,
        status, meetingId, groupId
      )
      return NextResponse.json({ ok: true })
    }

    if (action === 'setRecording') {
      await (prisma as any).$executeRawUnsafe(
        `UPDATE "Meeting" SET recordingUrl = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ? AND groupId = ?`,
        recordingUrl ?? null, meetingId, groupId
      )
      return NextResponse.json({ ok: true })
    }

    if (action === 'update') {
      await (prisma as any).$executeRawUnsafe(`
        UPDATE "Meeting" SET
          title = COALESCE(?, title),
          date = COALESCE(?, date),
          time = COALESCE(?, time),
          meetingLink = COALESCE(?, meetingLink),
          updatedAt = CURRENT_TIMESTAMP
        WHERE id = ? AND groupId = ?
      `, title ?? null, date ?? null, time ?? null, meetingLink ?? null, meetingId, groupId)
      return NextResponse.json({ ok: true })
    }

    if (action === 'delete') {
      await (prisma as any).$executeRawUnsafe(
        `DELETE FROM "Meeting" WHERE id = ? AND groupId = ?`, meetingId, groupId
      )
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: 'unknown action' }, { status: 400 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
