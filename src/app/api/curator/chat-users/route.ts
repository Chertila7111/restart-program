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

    let rows: any[]

    if (role === 'admin') {
      rows = await (prisma as any).$queryRawUnsafe(`
        SELECT u.id, u.name, u.email, u.role, pp.speciality, pp.bio
        FROM "User" u
        LEFT JOIN "PsychologistProfile" pp ON pp.userId = u.id
        WHERE u.role IN ('user', 'psychologist', 'admin')
        ORDER BY CASE u.role WHEN 'user' THEN 1 ELSE 0 END, u.name
      `)
    } else {
      rows = await (prisma as any).$queryRawUnsafe(`
        SELECT u.id, u.name, u.email, u.role, pp.speciality, pp.bio
        FROM "User" u
        LEFT JOIN "PsychologistProfile" pp ON pp.userId = u.id
        WHERE u.role IN ('psychologist', 'admin')
           OR (u.role = 'user' AND EXISTS (
             SELECT 1 FROM "GroupParticipant" gp
             JOIN "Group" g ON g.id = gp.groupId
             WHERE gp.userId = u.id AND g.curatorId = ? AND gp.status = 'active'
           ))
        ORDER BY CASE u.role WHEN 'user' THEN 1 ELSE 0 END, u.name
      `, curatorId)
    }

    return NextResponse.json(Array.isArray(rows) ? rows : [])
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
