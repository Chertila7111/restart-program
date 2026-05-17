import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const sessionRole = (session.user as any).role
    if (sessionRole !== 'psychologist' && sessionRole !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const { name, speciality, approach, education, experience, bio } = await req.json()

    const user = await prisma.user.findUnique({ where: { email: session.user.email } })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (name) await prisma.user.update({ where: { id: user.id }, data: { name } })

    await (prisma as any).psychologistProfile.upsert({
      where: { userId: user.id },
      update: { speciality: speciality || null, approach: approach || null, education: education || null, experience: experience || null, bio: bio || null },
      create: { userId: user.id, speciality: speciality || null, approach: approach || null, education: education || null, experience: experience || null, bio: bio || null },
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('psych-profile error:', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
