import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { ensureDb } from '@/lib/db-init'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const role = (session.user as any).role as string
  if (role !== 'psychologist' && role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const specialistId = (session.user as any).id as string

  try {
    await ensureDb()

    // All slots for this specialist (past + future, for calendar display)
    const rawSlots = await (prisma as any).$queryRawUnsafe(`
      SELECT s.id, s.startAt, s.durationMin, s.isBooked, s.note,
             u.name as userName, u.email as userEmail,
             b.status as bookingStatus
      FROM "AvailableSlot" s
      LEFT JOIN "Booking" b ON b.slotId = s.id
      LEFT JOIN "User" u ON u.id = b.userId
      WHERE s.doctorId = ?
        AND s.startAt >= datetime('now', '-60 days')
      ORDER BY s.startAt ASC
      LIMIT 200
    `, specialistId)

    const slots = (Array.isArray(rawSlots) ? rawSlots : []).map((s: any) => ({
      id: s.id,
      startAt: s.startAt instanceof Date ? s.startAt.toISOString() : String(s.startAt),
      durationMin: s.durationMin,
      isBooked: Boolean(s.isBooked),
      note: s.note ?? null,
      userName: s.userName ?? null,
      userEmail: s.userEmail ?? null,
      bookingStatus: s.bookingStatus ?? null,
    }))

    // Group meetings for this specialist
    const rawMeetings = await (prisma as any).$queryRawUnsafe(`
      SELECT m.id, m.title, m.date, m.time, m.duration, m.meetingLink, m.status,
             g.title as groupTitle
      FROM "Meeting" m
      JOIN "Group" g ON g.id = m.groupId
      WHERE g.psychologistId = ?
        AND m.date >= date('now', '-60 days')
      ORDER BY m.date ASC, m.time ASC
      LIMIT 100
    `, specialistId)

    const meetings = Array.isArray(rawMeetings) ? rawMeetings : []

    return NextResponse.json({ slots, meetings })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
