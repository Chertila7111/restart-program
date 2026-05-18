import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const sessionRole = (session.user as any).role
    if (sessionRole !== 'psychologist' && sessionRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { name } = body
    const speciality  = (body.speciality  ?? '') as string
    const approach    = (body.approach    ?? '') as string
    const education   = (body.education   ?? '') as string
    const experience  = (body.experience  ?? '') as string
    const bio         = (body.bio         ?? '') as string
    const workStyle   = (body.workStyle   ?? '') as string
    const quote       = (body.quote       ?? '') as string
    const photoUrl    = (body.photoUrl    ?? '') as string
    const meetingLink = (body.meetingLink ?? '') as string

    await ensureDb()
    const user = (await (prisma as any).$queryRawUnsafe(
      `SELECT id FROM "User" WHERE email = ? LIMIT 1`, session.user.email
    )) as { id: string }[]
    if (!user[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const userId = user[0].id

    if (name) {
      await (prisma as any).$executeRawUnsafe(
        `UPDATE "User" SET name = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`, name, userId
      )
    }

    const exists = (await (prisma as any).$queryRawUnsafe(
      `SELECT id FROM "PsychologistProfile" WHERE userId = ? LIMIT 1`, userId
    )) as { id: string }[]
    if (exists[0]) {
      await (prisma as any).$executeRawUnsafe(
        `UPDATE "PsychologistProfile"
         SET speciality=?, approach=?, education=?, experience=?, bio=?, workStyle=?, quote=?, photoUrl=?, meetingLink=?, updatedAt=CURRENT_TIMESTAMP
         WHERE userId=?`,
        speciality, approach, education, experience, bio, workStyle, quote, photoUrl, meetingLink, userId
      )
    } else {
      const id = `psych-${userId}`
      await (prisma as any).$executeRawUnsafe(
        `INSERT INTO "PsychologistProfile" (id,userId,speciality,approach,education,experience,bio,workStyle,quote,photoUrl,meetingLink,createdAt,updatedAt)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)`,
        id, userId, speciality, approach, education, experience, bio, workStyle, quote, photoUrl, meetingLink
      )
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[psych-profile POST]', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const sessionRole = (session.user as any).role
    if (sessionRole !== 'psychologist' && sessionRole !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    await ensureDb()
    const user = (await (prisma as any).$queryRawUnsafe(
      `SELECT id, name FROM "User" WHERE email = ? LIMIT 1`, session.user.email
    )) as { id: string; name: string | null }[]
    if (!user[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const profile = (await (prisma as any).$queryRawUnsafe(
      `SELECT speciality, approach, education, experience, bio, workStyle, quote, photoUrl, meetingLink
       FROM "PsychologistProfile" WHERE userId = ? LIMIT 1`, user[0].id
    )) as any[]
    const p = profile[0] ?? {}
    return NextResponse.json({
      name: user[0].name ?? '',
      speciality:  p.speciality  ?? '',
      approach:    p.approach    ?? '',
      education:   p.education   ?? '',
      experience:  p.experience  ?? '',
      bio:         p.bio         ?? '',
      workStyle:   p.workStyle   ?? '',
      quote:       p.quote       ?? '',
      photoUrl:    p.photoUrl    ?? '',
      meetingLink: p.meetingLink ?? '',
    })
  } catch (e) {
    console.error('[psych-profile GET]', e)
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
