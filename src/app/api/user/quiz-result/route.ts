import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  let category: string, situation: string
  try {
    const body = await req.json()
    category = body.category
    situation = body.situation
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 })
  }

  if (!category || !situation) return NextResponse.json({ error: 'missing fields' }, { status: 400 })

  try {
    await ensureDb()
    await (prisma as any).user.update({
      where: { email: session.user.email },
      data: { quizCategory: category, quizSituation: situation },
    })
  } catch { /* DB unavailable — localStorage fallback is sufficient */ }

  return NextResponse.json({ ok: true })
}
