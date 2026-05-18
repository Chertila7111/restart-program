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
    const slots = await (prisma as any).$queryRawUnsafe(
      `SELECT id, weekday, startTime, endTime, duration, type FROM "SpecialistAvailability" WHERE specialistId = ? ORDER BY weekday, startTime`,
      specialistId
    )
    return NextResponse.json({ slots: Array.isArray(slots) ? slots : [] })
  } catch {
    return NextResponse.json({ slots: [] })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!session?.user || (role !== 'psychologist' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const specialistId = (session.user as any).id as string
  const { slots } = await req.json()
  if (!Array.isArray(slots)) return NextResponse.json({ error: 'Invalid' }, { status: 400 })

  try {
    await ensureDb()
    // Replace all slots for this specialist
    await (prisma as any).$executeRawUnsafe(
      `DELETE FROM "SpecialistAvailability" WHERE specialistId = ?`,
      specialistId
    )
    const base = Date.now()
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i]
      const id = `sa-${base}-${i}-${Math.random().toString(36).slice(2)}`
      await (prisma as any).$executeRawUnsafe(
        `INSERT INTO "SpecialistAvailability" (id, specialistId, weekday, startTime, endTime, duration, type, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        id, specialistId, s.weekday, s.startTime, s.endTime, s.duration ?? 60, s.type ?? 'individual'
      )
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
