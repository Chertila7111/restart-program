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
    const bookings = await (prisma as any).booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        slot: { include: { doctor: { select: { id: true, name: true } } } },
      },
    })
    return NextResponse.json(bookings)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const userId = (session.user as any).id as string

  try {
    await ensureDb()
    const body = await req.json()
    const { slotId, notes } = body as { slotId: string; notes?: string }

    if (!slotId) return NextResponse.json({ error: 'slotId required' }, { status: 400 })

    // Check slot is free
    const slot = await (prisma as any).availableSlot.findUnique({ where: { id: slotId } })
    if (!slot) return NextResponse.json({ error: 'slot not found' }, { status: 404 })
    if (slot.isBooked) return NextResponse.json({ error: 'slot already booked' }, { status: 409 })

    // Check user doesn't already have a booking for this slot
    const existing = await (prisma as any).booking.findFirst({ where: { userId, slotId } })
    if (existing) return NextResponse.json({ error: 'already booked' }, { status: 409 })

    const bookingId = `booking-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const notesSafe = (notes ?? '').replace(/'/g, "''")

    await (prisma as any).$executeRawUnsafe(
      `INSERT INTO "Booking" ("id","userId","slotId","type","status","notes","createdAt") VALUES ('${bookingId}', '${userId}', '${slotId}', 'individual', 'confirmed', '${notesSafe}', CURRENT_TIMESTAMP)`
    )
    await (prisma as any).$executeRawUnsafe(
      `UPDATE "AvailableSlot" SET "isBooked" = 1 WHERE "id" = '${slotId}'`
    )

    const booking = await (prisma as any).booking.findUnique({
      where: { id: bookingId },
      include: { slot: { include: { doctor: { select: { id: true, name: true } } } } },
    })
    return NextResponse.json(booking, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
