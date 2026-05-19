import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { ensureDb } from '@/lib/db-init'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const role = (session.user as any).role as string
  const curatorId = (session.user as any).id as string

  try {
    await ensureDb()

    // All meetings for groups this curator manages (or all groups if admin)
    const meetings = await (prisma as any).$queryRawUnsafe(`
      SELECT m.id, m.type, m.title, m.description, m.date, m.time, m.duration,
             m.meetingLink, m.recordingUrl, m.status, m.groupId, m.participantId,
             g.title as groupTitle,
             u.name as participantName, u.email as participantEmail
      FROM "Meeting" m
      LEFT JOIN "Group" g ON g.id = m.groupId
      LEFT JOIN "User" u ON u.id = m.participantId
      WHERE m.groupId IN (
        SELECT id FROM "Group" WHERE ? = 'admin' OR curatorId = ?
      )
      ORDER BY m.date ASC, m.time ASC
    `, role, curatorId)

    return NextResponse.json(Array.isArray(meetings) ? meetings : [])
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
