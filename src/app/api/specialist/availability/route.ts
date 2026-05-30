import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
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

// Generate actual AvailableSlot records from a weekly availability pattern
// pattern: weekday(0=Mon..6=Sun), startTime(HH:mm), endTime(HH:mm), duration(min)
// Returns count of newly created slots
async function generateSlots(
  specialistId: string,
  patterns: { weekday: number; startTime: string; endTime: string; duration: number }[],
  weeksAhead: number,
  tzOffsetMin: number,  // from client: new Date().getTimezoneOffset() (negative for east, e.g. MSK=-180)
): Promise<number> {
  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  let created = 0

  for (const pat of patterns) {
    const startParts = pat.startTime.split(':').map(Number)
    const endParts = pat.endTime.split(':').map(Number)
    const startMin = startParts[0] * 60 + (startParts[1] || 0)
    const endMin = endParts[0] * 60 + (endParts[1] || 0)

    // JS: 0=Sun,1=Mon..6=Sat  →  our weekday 0=Mon..6=Sun
    const jsDow = (pat.weekday + 1) % 7

    for (let week = 0; week < weeksAhead; week++) {
      const base = new Date(today)
      base.setUTCDate(base.getUTCDate() + week * 7)
      const dayOffset = (jsDow - base.getUTCDay() + 7) % 7
      const slotDate = new Date(base)
      slotDate.setUTCDate(slotDate.getUTCDate() + dayOffset)

      let cursor = startMin
      while (cursor + pat.duration <= endMin) {
        // Convert specialist's local time to UTC using their browser timezone offset
        // getTimezoneOffset() returns negative for east-of-UTC, so: UTC = local + offset
        const utcCursorMin = cursor + tzOffsetMin
        const utcH = Math.floor(utcCursorMin / 60)
        const utcM = utcCursorMin % 60

        const slotStart = new Date(Date.UTC(
          slotDate.getUTCFullYear(),
          slotDate.getUTCMonth(),
          slotDate.getUTCDate() + Math.floor(utcCursorMin / (24 * 60)),  // handle day rollover
          ((utcH % 24) + 24) % 24,
          ((utcM % 60) + 60) % 60,
        ))

        // Skip past slots
        if (slotStart <= new Date()) { cursor += pat.duration; continue }

        const startAtISO = slotStart.toISOString()

        // Check if slot already exists to ensure idempotency
        const existing = await (prisma as any).$queryRawUnsafe(
          `SELECT id FROM "AvailableSlot" WHERE doctorId = ? AND startAt = ? LIMIT 1`,
          specialistId, startAtISO
        )
        if (!Array.isArray(existing) || existing.length === 0) {
          const slotId = `slot-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
          await (prisma as any).$executeRawUnsafe(
            `INSERT INTO "AvailableSlot" (id, doctorId, startAt, durationMin, isBooked, note, createdAt) VALUES (?, ?, ?, ?, 0, '', CURRENT_TIMESTAMP)`,
            slotId, specialistId, startAtISO, pat.duration
          )
          created++
        }
        cursor += pat.duration
      }
    }
  }

  return created
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!session?.user || (role !== 'psychologist' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const specialistId = (session.user as any).id as string
  const body = await req.json()
  const { slots, weeksAhead = 4, timezoneOffset = -180 } = body as { slots: any[]; weeksAhead?: number; timezoneOffset?: number }
  if (!Array.isArray(slots)) return NextResponse.json({ error: 'Invalid' }, { status: 400 })

  const weeks = Math.min(Math.max(Number(weeksAhead) || 4, 1), 12)

  try {
    await ensureDb()

    // Save recurring pattern atomically
    await (prisma as any).$executeRawUnsafe(
      `DELETE FROM "SpecialistAvailability" WHERE specialistId = ?`,
      specialistId
    )
    const base = Date.now()
    // Build single batch VALUES to avoid partial-write on failure
    if (slots.length > 0) {
      const placeholders = slots.map(() => '(?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)').join(', ')
      const values: any[] = []
      slots.forEach((s, i) => {
        const id = `sa-${base}-${i}-${Math.random().toString(36).slice(2)}`
        values.push(id, specialistId, s.weekday, s.startTime, s.endTime, s.duration ?? 60, s.type ?? 'individual')
      })
      await (prisma as any).$executeRawUnsafe(
        `INSERT INTO "SpecialistAvailability" (id, specialistId, weekday, startTime, endTime, duration, type, createdAt) VALUES ${placeholders}`,
        ...values
      )
    }

    // Auto-generate concrete AvailableSlot records for the next N weeks
    const generated = await generateSlots(specialistId, slots, weeks, timezoneOffset)

    return NextResponse.json({ ok: true, generated, weeks })
  } catch (err: any) {
    console.error('[availability] save error:', err)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
