import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id as string
  if (!userId) return NextResponse.json({ error: 'Invalid session' }, { status: 401 })

  try {
    await ensureDb()

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
    })

    const orders = await (prisma as any).$queryRawUnsafe(`
      SELECT id, product, productName, amount, status, createdAt FROM "Order" WHERE userId = ?
    `, userId) as Record<string, unknown>[]

    const journal = await (prisma as any).$queryRawUnsafe(`
      SELECT id, date, type, mood, anxiety, energy, sleep, triggers, helpers, note, nextStep, createdAt
      FROM "JournalEntry" WHERE userId = ?
      ORDER BY createdAt DESC
    `, userId) as Record<string, unknown>[]

    const profile = await (prisma as any).$queryRawUnsafe(`
      SELECT city, timezone, telegram, about, situation, goals FROM "UserProfile" WHERE userId = ? LIMIT 1
    `, userId) as Record<string, unknown>[]

    const consents = await (prisma as any).$queryRawUnsafe(`
      SELECT consentType, consentVersion, accepted, acceptedAt FROM "ConsentLog" WHERE userId = ?
      ORDER BY acceptedAt ASC
    `, userId) as Record<string, unknown>[]

    const exportData = {
      exportedAt: new Date().toISOString(),
      user,
      profile: profile[0] ?? null,
      orders: Array.isArray(orders) ? orders : [],
      journal: Array.isArray(journal) ? journal : [],
      consents: Array.isArray(consents) ? consents : [],
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="my-data-${userId.slice(0, 8)}.json"`,
      },
    })
  } catch (error) {
    console.error('user export error:', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
