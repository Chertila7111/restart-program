import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { ensureDb } from '@/lib/db-init'
import { prisma } from '@/lib/prisma'

const ALLOWED_STATUSES = ['completed', 'cancelled', 'confirmed']

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!session?.user || (role !== 'psychologist' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id: bookingId } = await params
  const body = await req.json()
  const { status } = body as { status: string }

  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  try {
    await ensureDb()

    const booking = await (prisma as any).booking.findUnique({ where: { id: bookingId } })
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await (prisma as any).$executeRawUnsafe(
      `UPDATE "Booking" SET status = ? WHERE id = ?`,
      status, bookingId
    )

    const updated = await (prisma as any).booking.findUnique({ where: { id: bookingId } })
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
