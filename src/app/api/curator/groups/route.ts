import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
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
    const raw = await (prisma as any).$queryRawUnsafe(`
      SELECT g.id, g.title, g.status, g.currentWeek, g.createdAt,
             COUNT(gp.id) as participantCount,
             u.name as psychologistName
      FROM "Group" g
      LEFT JOIN "GroupParticipant" gp ON gp.groupId = g.id AND gp.status = 'active'
      LEFT JOIN "User" u ON u.id = g.psychologistId
      WHERE ${role === 'admin' ? '1=1' : 'g.curatorId = ?'}
      GROUP BY g.id
      ORDER BY g.createdAt DESC
    `, ...(role === 'admin' ? [] : [curatorId]))
    return NextResponse.json(Array.isArray(raw) ? raw : [])
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const role = (session.user as any).role as string
  const curatorId = (session.user as any).id as string

  if (role !== 'curator' && role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  try {
    await ensureDb()
    const body = await req.json()
    const { title, psychologistId } = body as { title: string; psychologistId?: string }

    if (!title?.trim()) return NextResponse.json({ error: 'title required' }, { status: 400 })

    const groupId = `group-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

    await (prisma as any).$executeRawUnsafe(`
      INSERT INTO "Group" ("id","title","psychologistId","status","currentWeek","curatorId","createdAt")
      VALUES (?, ?, ?, 'recruiting', 1, ?, CURRENT_TIMESTAMP)
    `, groupId, title.trim(), psychologistId || null, curatorId)

    return NextResponse.json({ id: groupId, title: title.trim(), status: 'recruiting', currentWeek: 1 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
