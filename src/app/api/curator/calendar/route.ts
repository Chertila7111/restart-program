import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { ensureDb } from '@/lib/db-init'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const role = (session.user as any).role as string
  const curatorId = (session.user as any).id as string
  const { searchParams } = new URL(req.url)
  const filterUserId = searchParams.get('userId') || ''

  try {
    await ensureDb()

    let meetings: any[]

    if (filterUserId) {
      // Meetings relevant to this specific user:
      // 1. Individual/intro/diagnostic meetings where participantId = filterUserId
      // 2. Group meetings for groups where filterUserId is a participant OR the psychologist
      meetings = await (prisma as any).$queryRawUnsafe(`
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
        AND (
          m.participantId = ?
          OR (m.type = 'group' AND m.groupId IN (
            SELECT groupId FROM "GroupParticipant" WHERE userId = ? AND status = 'active'
          ))
          OR (m.type = 'group' AND m.groupId IN (
            SELECT id FROM "Group" WHERE psychologistId = ?
          ))
        )
        ORDER BY m.date ASC, m.time ASC
      `, role, curatorId, filterUserId, filterUserId, filterUserId)
    } else {
      meetings = await (prisma as any).$queryRawUnsafe(`
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
    }

    // Also return all persons in curator's groups for the filter dropdown
    const persons = await (prisma as any).$queryRawUnsafe(`
      SELECT DISTINCT u.id, u.name, u.email, u.role
      FROM "User" u
      WHERE u.id IN (
        SELECT gp.userId FROM "GroupParticipant" gp
        JOIN "Group" g ON g.id = gp.groupId
        WHERE gp.status = 'active' AND (? = 'admin' OR g.curatorId = ?)
      )
      OR u.id IN (
        SELECT g.psychologistId FROM "Group" g
        WHERE (? = 'admin' OR g.curatorId = ?) AND g.psychologistId IS NOT NULL
      )
      ORDER BY u.name
    `, role, curatorId, role, curatorId)

    return NextResponse.json({
      meetings: Array.isArray(meetings) ? meetings : [],
      persons: Array.isArray(persons) ? persons : [],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
