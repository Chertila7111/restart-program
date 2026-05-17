import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { ensureDb } from '@/lib/db-init'
import { prisma } from '@/lib/prisma'
import { CalendarUI } from './CalendarUI'

export default async function CalendarPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/auth/login')

  const userId = (session.user as any).id as string
  const userRole = (session.user as any).role as string

  let slots: { id: string; startAt: string; durationMin: number; note: string | null; doctor: { name: string | null } }[] = []
  let bookings: { id: string; slotId: string; status: string; slot: { startAt: string; durationMin: number } }[] = []

  try {
    await ensureDb()

    const rawSlots = await (prisma as any).availableSlot.findMany({
      where: { isBooked: 0, startAt: { gt: new Date() } },
      orderBy: { startAt: 'asc' },
      include: { doctor: { select: { name: true } } },
    })
    slots = rawSlots.map((s: any) => ({
      id: s.id,
      startAt: s.startAt instanceof Date ? s.startAt.toISOString() : String(s.startAt),
      durationMin: s.durationMin,
      note: s.note,
      doctor: s.doctor,
    }))

    const rawBookings = await (prisma as any).booking.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { slot: true },
    })
    bookings = rawBookings.map((b: any) => ({
      id: b.id,
      slotId: b.slotId,
      status: b.status,
      slot: {
        startAt: b.slot.startAt instanceof Date ? b.slot.startAt.toISOString() : String(b.slot.startAt),
        durationMin: b.slot.durationMin,
      },
    }))
  } catch (err) {
    console.error('[calendar] DB error:', err)
  }

  return (
    <div style={{ maxWidth: '44rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Календарь</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Индивидуальные встречи с психологом</p>
      <CalendarUI slots={slots} bookings={bookings} userRole={userRole} />
    </div>
  )
}
