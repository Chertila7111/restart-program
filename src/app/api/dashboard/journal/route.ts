import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
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

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const entryId = searchParams.get('id')
    if (!entryId) return NextResponse.json({ error: 'id required' }, { status: 400 })

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Ownership check: only delete own entries
    const entry = await prisma.journalEntry.findFirst({
      where: { id: entryId, userId: user.id },
    })
    if (!entry) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await prisma.journalEntry.delete({ where: { id: entryId } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Journal DELETE error:', e)
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

    if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json({ error: 'Missing or invalid date' }, { status: 400 })
    }
    if (!['daily', 'quick', 'week_summary'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    const clampNum = (v: unknown, min = 1, max = 10): number => {
      const n = Number(v)
      if (!Number.isFinite(n)) return min
      return Math.max(min, Math.min(max, Math.round(n)))
    }
    const truncate = (v: unknown, maxLen = 3000): string | null =>
      typeof v === 'string' ? v.slice(0, maxLen) : null
    const SLEEP_VALUES = ['ok', 'bad', 'great', 'none']

    const buildData = (type: string, rest: Record<string, unknown>) => {
      if (type === 'daily') {
        const { mood, anxiety, urgeToWrite, energy, sleep, triggers, helpers, note, nextStep, sharedWithSpecialist } = rest
        const sleepVal = SLEEP_VALUES.includes(sleep as string) ? (sleep as string) : 'ok'
        const triggersArr = Array.isArray(triggers) ? triggers.slice(0, 20).map(String).map(s => s.slice(0, 200)) : null
        const helpersArr = Array.isArray(helpers) ? helpers.slice(0, 20).map(String).map(s => s.slice(0, 200)) : null
        return {
          mood: clampNum(mood, 1, 10),
          anxiety: clampNum(anxiety, 1, 10),
          urgeToWrite: clampNum(urgeToWrite, 1, 10),
          energy: clampNum(energy, 1, 10),
          sleep: sleepVal,
          triggers: triggersArr ? JSON.stringify(triggersArr) : null,
          helpers: helpersArr ? JSON.stringify(helpersArr) : null,
          note: truncate(note),
          nextStep: truncate(nextStep, 1000),
          sharedWithSpecialist: !!sharedWithSpecialist,
        }
      }
      if (type === 'quick') {
        const { situation, intensity, wantToDo, saferAction } = rest
        return {
          situation: truncate(situation),
          intensity: intensity != null ? clampNum(intensity, 1, 10) : null,
          wantToDo: truncate(wantToDo),
          saferAction: truncate(saferAction),
        }
      }
      if (type === 'week_summary') {
        const { weekSum1, weekSum2, weekSum3, weekSum4, weekSum5 } = rest
        return {
          weekSum1: truncate(weekSum1),
          weekSum2: truncate(weekSum2),
          weekSum3: truncate(weekSum3),
          weekSum4: truncate(weekSum4),
          weekSum5: truncate(weekSum5),
        }
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
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
