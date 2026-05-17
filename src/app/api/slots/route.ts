import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { ensureDb } from '@/lib/db-init'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  try {
    await ensureDb()
    const slots = await (prisma as any).availableSlot.findMany({
      where: { isBooked: 0, startAt: { gt: new Date() } },
      orderBy: { startAt: 'asc' },
      include: { doctor: { select: { id: true, name: true } } },
    })
    return NextResponse.json(slots)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id as string
  const role = (session?.user as any)?.role as string
  if (role !== 'admin' && role !== 'psychologist') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  try {
    await ensureDb()
    const body = await req.json()
    const { startAt, durationMin, note } = body as { startAt: string; durationMin?: number; note?: string }

    if (!startAt) return NextResponse.json({ error: 'startAt required' }, { status: 400 })

    const slotId = `slot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    // admin uses doctor account; psychologist uses their own id
    const doctorId = role === 'psychologist' ? userId : 'doctor-maria-sokolova'
    const dur = durationMin ?? 45
    const noteSafe = (note ?? '').replace(/'/g, "''")
    const startDate = new Date(startAt).toISOString()

    await (prisma as any).$executeRawUnsafe(
      `INSERT INTO "AvailableSlot" ("id","doctorId","startAt","durationMin","isBooked","note","createdAt") VALUES ('${slotId}', '${doctorId}', '${startDate}', ${dur}, 0, '${noteSafe}', CURRENT_TIMESTAMP)`
    )

    const slot = await (prisma as any).availableSlot.findUnique({ where: { id: slotId } })
    return NextResponse.json(slot, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (role !== 'admin' && role !== 'psychologist') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  try {
    await ensureDb()
    const { searchParams } = new URL(req.url)
    const slotId = searchParams.get('id')
    if (!slotId) return NextResponse.json({ error: 'id required' }, { status: 400 })

    await (prisma as any).availableSlot.delete({ where: { id: slotId } })
    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
