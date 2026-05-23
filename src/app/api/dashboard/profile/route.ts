import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id as string
  try {
    await ensureDb()
    const rows = await (prisma as any).$queryRawUnsafe(
      `SELECT age, city, timezone, telegram, about, situation, mainPain, goals, moodNow, diaryAccess FROM "UserProfile" WHERE userId = ? LIMIT 1`,
      userId
    )
    if (!rows.length) return NextResponse.json({ profile: null })
    const p = rows[0]
    return NextResponse.json({
      profile: { ...p, goals: p.goals ? JSON.parse(p.goals) : [], moodNow: String(p.moodNow ?? '5') }
    })
  } catch {
    return NextResponse.json({ profile: null })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id as string
  if (!userId) return NextResponse.json({ error: 'No user id' }, { status: 400 })

  const body = await req.json()
  const age         = (body.age         ?? '') as string
  const city        = (body.city        ?? '') as string
  const timezone    = (body.timezone    ?? 'Europe/Moscow') as string
  const telegram    = (body.telegram    ?? '') as string
  const about       = (body.about       ?? '') as string
  const situation   = (body.situation   ?? '') as string
  const mainPain    = (body.mainPain    ?? '') as string
  const diaryAccess = (body.diaryAccess ?? 'private') as string
  const goalsJson   = JSON.stringify(Array.isArray(body.goals) ? body.goals : [])
  const moodNow     = body.moodNow ? Number(body.moodNow) : 5

  try {
    await ensureDb()
    const exists = await (prisma as any).$queryRawUnsafe(`SELECT id FROM "UserProfile" WHERE userId = ? LIMIT 1`, userId)
    if (exists && exists.length > 0) {
      await (prisma as any).$executeRawUnsafe(
        `UPDATE "UserProfile" SET age=?, city=?, timezone=?, telegram=?, about=?, situation=?, mainPain=?, goals=?, moodNow=?, diaryAccess=?, updatedAt=CURRENT_TIMESTAMP WHERE userId=?`,
        age, city, timezone, telegram, about, situation, mainPain, goalsJson, moodNow, diaryAccess, userId
      )
    } else {
      const id = `up-${Date.now()}`
      await (prisma as any).$executeRawUnsafe(
        `INSERT INTO "UserProfile" (id, userId, age, city, timezone, telegram, about, situation, mainPain, goals, moodNow, diaryAccess, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        id, userId, age, city, timezone, telegram, about, situation, mainPain, goalsJson, moodNow, diaryAccess
      )
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
