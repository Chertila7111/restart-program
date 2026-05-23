import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { ensureDb } from '@/lib/db-init'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  try {
    await ensureDb()
    const users = (await (prisma as any).$queryRawUnsafe(`
      SELECT u.id, u.name, u.role,
             pp.speciality, pp.bio, pp.photoUrl
      FROM "User" u
      LEFT JOIN "PsychologistProfile" pp ON pp.userId = u.id
      WHERE u.role IN ('psychologist', 'admin')
      ORDER BY u.role DESC, u.name ASC
    `)) as any[]

    return NextResponse.json(users)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
