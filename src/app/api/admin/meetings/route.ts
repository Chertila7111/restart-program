import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'

async function assertAdmin() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!session || (role !== 'admin' && role !== 'psychologist')) return null
  return session
}

export async function GET() {
  const session = await assertAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await ensureDb()
  const meetings = (await (prisma as any).$queryRawUnsafe(`
    SELECT m.*, u.name as doctorName
    FROM "Meeting" m
    LEFT JOIN "User" u ON u.id = m.doctorId
    ORDER BY m.date DESC, m.time DESC
    LIMIT 100
  `)) as any[]

  return NextResponse.json({ meetings })
}

export async function POST(req: Request) {
  const session = await assertAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { type, title, description, date, time, duration, meetingLink, doctorId, targetTiers } = body

  if (!title || !date || !time) {
    return NextResponse.json({ error: 'title, date, time обязательны' }, { status: 400 })
  }

  await ensureDb()
  const id = `meeting-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const createdBy = (session.user as any)?.id ?? session.user?.email

  await (prisma as any).$executeRawUnsafe(
    `INSERT INTO "Meeting" (id, type, title, description, date, time, duration, meetingLink, doctorId, targetTiers, status, createdBy, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled', ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
    id, type ?? 'custom', title, description ?? '', date, time,
    duration ?? '90 мин', meetingLink ?? '', doctorId ?? null,
    JSON.stringify(targetTiers ?? ['intro', 'base', 'plus', 'personal']),
    createdBy
  )

  return NextResponse.json({ ok: true, id })
}

export async function PATCH(req: Request) {
  const session = await assertAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { id, status, meetingLink, date, time } = body
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  await ensureDb()
  if (status) {
    await (prisma as any).$executeRawUnsafe(
      `UPDATE "Meeting" SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`, status, id
    )
  }
  if (meetingLink !== undefined) {
    await (prisma as any).$executeRawUnsafe(
      `UPDATE "Meeting" SET meetingLink = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`, meetingLink, id
    )
  }
  if (date && time) {
    await (prisma as any).$executeRawUnsafe(
      `UPDATE "Meeting" SET date = ?, time = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`, date, time, id
    )
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const session = await assertAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  await ensureDb()
  await (prisma as any).$executeRawUnsafe(`DELETE FROM "Meeting" WHERE id = ?`, id)

  return NextResponse.json({ ok: true })
}
