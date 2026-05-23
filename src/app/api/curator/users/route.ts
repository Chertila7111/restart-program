import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { ensureDb } from '@/lib/db-init'
import { prisma } from '@/lib/prisma'

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return '***'
  const visible = local.slice(0, 2)
  return `${visible}***@${domain}`
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const role = (session.user as any).role as string
  if (role !== 'curator' && role !== 'admin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const excludeGroup = searchParams.get('excludeGroup') || ''
  const filterRole = searchParams.get('role') || 'user'

  try {
    await ensureDb()

    let rows: { id: string; name: string | null; email: string }[]

    if (filterRole === 'user') {
      rows = await (prisma as any).$queryRawUnsafe(`
        SELECT u.id, u.name, u.email
        FROM "User" u
        WHERE u.role = 'user'
          AND (? = '' OR LOWER(u.name) LIKE LOWER(?) OR LOWER(u.email) LIKE LOWER(?))
          AND (? = '' OR NOT EXISTS (
            SELECT 1 FROM "GroupParticipant" gp
            WHERE gp.userId = u.id AND gp.groupId = ? AND gp.status = 'active'
          ))
        ORDER BY u.name, u.email
        LIMIT 20
      `, q, `%${q}%`, `%${q}%`, excludeGroup, excludeGroup)
    } else {
      rows = await (prisma as any).$queryRawUnsafe(`
        SELECT u.id, u.name, u.email
        FROM "User" u
        WHERE u.role = ?
          AND (? = '' OR LOWER(u.name) LIKE LOWER(?) OR LOWER(u.email) LIKE LOWER(?))
        ORDER BY u.name, u.email
        LIMIT 20
      `, filterRole, q, `%${q}%`, `%${q}%`)
    }

    if (!Array.isArray(rows)) return NextResponse.json([])

    // Admins see full email; curators see masked email to preserve user privacy
    const result = rows.map(r => ({
      id: r.id,
      name: r.name,
      email: role === 'admin' ? r.email : maskEmail(r.email),
    }))

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'unknown' }, { status: 500 })
  }
}
