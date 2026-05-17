import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const sessionRole = (session.user as any).role
    if (sessionRole !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { userId, role } = await req.json()
    if (!userId || !role) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    if (!['user', 'psychologist'].includes(role)) return NextResponse.json({ error: 'Invalid role' }, { status: 400 })

    await prisma.user.update({ where: { id: userId }, data: { role } })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
