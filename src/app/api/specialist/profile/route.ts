import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'

export async function GET() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!session?.user || (role !== 'psychologist' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const userId = (session.user as any).id as string
  try {
    await ensureDb()
    const rows = await (prisma as any).$queryRawUnsafe(
      `SELECT speciality, approach, education, experience, bio, workStyle, quote, photoUrl, meetingLink FROM "PsychologistProfile" WHERE userId = ? LIMIT 1`,
      userId
    )
    if (!rows.length) return NextResponse.json({ profile: null })
    const p = rows[0]
    return NextResponse.json({
      profile: {
        speciality:  p.speciality  ?? '',
        approach:    p.approach    ?? '',
        education:   p.education   ?? '',
        experience:  p.experience  ?? '',
        bio:         p.bio         ?? '',
        workStyle:   p.workStyle   ?? '',
        quote:       p.quote       ?? '',
        photoUrl:    p.photoUrl    ?? '',
        meetingLink: p.meetingLink ?? '',
      }
    })
  } catch (err) {
    console.error('[specialist/profile GET]', err)
    return NextResponse.json({ profile: null })
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!session?.user || (role !== 'psychologist' && role !== 'admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const userId = (session.user as any).id as string
  if (!userId) return NextResponse.json({ error: 'No user id' }, { status: 400 })

  const body = await req.json()
  const speciality  = (body.speciality  ?? '') as string
  const approach    = (body.approach    ?? '') as string
  const education   = (body.education   ?? '') as string
  const experience  = (body.experience  ?? '') as string
  const bio         = (body.bio         ?? '') as string
  const workStyle   = (body.workStyle   ?? '') as string
  const quote       = (body.quote       ?? '') as string
  const photoUrl    = (body.photoUrl    ?? '') as string
  const meetingLink = (body.meetingLink ?? '') as string

  try {
    await ensureDb()
    const exists = await (prisma as any).$queryRawUnsafe(
      `SELECT id FROM "PsychologistProfile" WHERE userId = ? LIMIT 1`, userId
    )

    if (exists && exists.length > 0) {
      await (prisma as any).$executeRawUnsafe(
        `UPDATE "PsychologistProfile"
         SET speciality = ?, approach = ?, education = ?, experience = ?, bio = ?, workStyle = ?, quote = ?, photoUrl = ?, meetingLink = ?, updatedAt = CURRENT_TIMESTAMP
         WHERE userId = ?`,
        speciality, approach, education, experience, bio, workStyle, quote, photoUrl, meetingLink, userId
      )
    } else {
      const id = `psych-${Date.now()}`
      await (prisma as any).$executeRawUnsafe(
        `INSERT INTO "PsychologistProfile" (id, userId, speciality, approach, education, experience, bio, workStyle, quote, photoUrl, meetingLink, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
        id, userId, speciality, approach, education, experience, bio, workStyle, quote, photoUrl, meetingLink
      )
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[specialist/profile POST]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
