import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import MeetingsManager from './MeetingsManager'

export default async function AdminMeetingsPage() {
  const session = await getServerSession(authOptions)
  const role = (session?.user as any)?.role
  if (!session || (role !== 'admin' && role !== 'psychologist')) redirect('/dashboard')

  await ensureDb()

  const doctors = (await (prisma as any).$queryRawUnsafe(
    `SELECT id, name FROM "User" WHERE role IN ('psychologist', 'admin') ORDER BY name`
  ).catch(() => [])) as { id: string; name: string | null }[]

  const meetings = (await (prisma as any).$queryRawUnsafe(`
    SELECT m.*, u.name as doctorName
    FROM "Meeting" m
    LEFT JOIN "User" u ON u.id = m.doctorId
    ORDER BY m.date DESC, m.time DESC
    LIMIT 100
  `).catch(() => [])) as any[]

  return (
    <div style={{ maxWidth: '52rem' }}>
      <Link
        href="/dashboard/admin"
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.825rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={14} /> Панель администратора
      </Link>

      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>
        Управление встречами
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.875rem' }}>
        Создавайте встречи из шаблонов — они сразу появятся у пациентов в кабинете
      </p>

      <MeetingsManager doctors={doctors} initial={meetings} />
    </div>
  )
}
