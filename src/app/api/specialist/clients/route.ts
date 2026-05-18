import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'

export async function GET() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!session?.user || (role !== 'psychologist' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const specialistId = (session.user as any).id as string
  try {
    await ensureDb()
    const clients = await (prisma as any).$queryRawUnsafe(`
      SELECT DISTINCT u.id, u.name FROM "GroupParticipant" gp
      JOIN "User" u ON u.id = gp.userId
      JOIN "Group" g ON g.id = gp.groupId
      WHERE g.psychologistId = ?
      ORDER BY u.name ASC
    `, specialistId)
    return NextResponse.json({ clients: Array.isArray(clients) ? clients : [] })
  } catch {
    return NextResponse.json({ clients: [] })
  }
}
