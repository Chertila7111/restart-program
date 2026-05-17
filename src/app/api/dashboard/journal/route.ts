import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const entries = await prisma.journalEntry.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 30,
    })
    return NextResponse.json(entries)
  } catch (e) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await req.json()
    const { date, type = 'daily', ...rest } = body

    if (!date) return NextResponse.json({ error: 'Missing date' }, { status: 400 })

    const buildData = (type: string, rest: Record<string, unknown>) => {
      if (type === 'daily') {
        const { mood, anxiety, urgeToWrite, energy, sleep, triggers, helpers, note, nextStep, sharedWithSpecialist } = rest
        return { mood: mood ?? 5, anxiety: anxiety ?? 5, urgeToWrite: urgeToWrite ?? 1, energy: energy ?? 5, sleep: sleep ?? 'ok', triggers: triggers ? JSON.stringify(triggers) : null, helpers: helpers ? JSON.stringify(helpers) : null, note: note || null, nextStep: nextStep || null, sharedWithSpecialist: !!sharedWithSpecialist }
      }
      if (type === 'quick') {
        const { situation, intensity, wantToDo, saferAction } = rest
        return { situation: situation || null, intensity: intensity ?? null, wantToDo: wantToDo || null, saferAction: saferAction || null }
      }
      if (type === 'week_summary') {
        const { weekSum1, weekSum2, weekSum3, weekSum4, weekSum5 } = rest
        return { weekSum1: weekSum1 || null, weekSum2: weekSum2 || null, weekSum3: weekSum3 || null, weekSum4: weekSum4 || null, weekSum5: weekSum5 || null }
      }
      return {}
    }

    const data = buildData(type, rest)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const entry = await (prisma.journalEntry as any).upsert({
      where: { userId_date_type: { userId: user.id, date, type } },
      update: { ...data },
      create: { userId: user.id, date, type, ...data },
    })

    return NextResponse.json(entry)
  } catch (e) {
    console.error('Journal API error:', e)
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
