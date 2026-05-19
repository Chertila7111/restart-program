import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { ensureDb } from '@/lib/db-init'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const userId = (session.user as any).id as string

  try {
    await ensureDb()

    const rows = await (prisma as any).$queryRawUnsafe(`
      SELECT u.id, u.name, u.email, up.about, up.photoUrl
      FROM "User" u
      LEFT JOIN "UserProfile" up ON up.userId = u.id
      WHERE u.id = ? LIMIT 1
    `, userId)

    const u = Array.isArray(rows) && rows[0] ? rows[0] : {}
    return NextResponse.json({
      profile: {
        name: u.name ?? session.user.name ?? '',
        bio: u.about ?? '',
        photoUrl: u.photoUrl ?? '',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const userId = (session.user as any).id as string

  try {
    await ensureDb()
    const body = await req.json()
    const { name, bio, photoUrl } = body as { name?: string; bio?: string; photoUrl?: string }

    if (name !== undefined) {
      await (prisma as any).$executeRawUnsafe(
        `UPDATE "User" SET name = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        name, userId
      )
    }

    const profileId = `up-${userId}`
    await (prisma as any).$executeRawUnsafe(`
      INSERT INTO "UserProfile" ("id","userId","about","photoUrl","createdAt","updatedAt")
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT ("userId") DO UPDATE SET
        about    = COALESCE(excluded.about,    about),
        photoUrl = COALESCE(excluded.photoUrl, photoUrl),
        updatedAt = CURRENT_TIMESTAMP
    `, profileId, userId, bio ?? null, photoUrl ?? null)

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
