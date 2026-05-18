import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { endpoint, keys } = body
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
  }

  await ensureDb()
  const user = (await (prisma as any).$queryRawUnsafe(
    `SELECT id FROM "User" WHERE email = ? LIMIT 1`, session.user.email
  )) as { id: string }[]
  if (!user[0]) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const userId = user[0].id
  const id = `ps-${userId}-${Date.now()}`

  await (prisma as any).$executeRawUnsafe(
    `INSERT OR REPLACE INTO "PushSubscription" ("id","userId","endpoint","p256dh","auth","createdAt")
     VALUES (COALESCE((SELECT id FROM "PushSubscription" WHERE userId=? AND endpoint=?), ?), ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    userId, endpoint, id, userId, endpoint, keys.p256dh, keys.auth
  )

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { endpoint } = body

  await ensureDb()
  const user = (await (prisma as any).$queryRawUnsafe(
    `SELECT id FROM "User" WHERE email = ? LIMIT 1`, session.user.email
  )) as { id: string }[]
  if (user[0]) {
    await (prisma as any).$executeRawUnsafe(
      `DELETE FROM "PushSubscription" WHERE userId = ? AND endpoint = ?`,
      user[0].id, endpoint
    )
  }

  return NextResponse.json({ ok: true })
}
