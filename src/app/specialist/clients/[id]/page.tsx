import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureDb } from '@/lib/db-init'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText, Lock, Calendar, Star, User } from 'lucide-react'
import { AddNoteForm } from './AddNoteForm'

export default async function ClientProfilePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const specialistId = (session?.user as any)?.id as string

  let client: any = null
  let journals: any[] = []
  let notes: any[] = []
  let hasAccess = false
  let inMyGroup = false

  try {
    await ensureDb()

    // Check this client is in specialist's group
    const check = await (prisma as any).$queryRawUnsafe(`
      SELECT gp.diaryAccessGranted, g.title as groupTitle, g.currentWeek
      FROM "GroupParticipant" gp
      JOIN "Group" g ON g.id = gp.groupId
      WHERE gp.userId = ? AND g.psychologistId = ?
      LIMIT 1
    `, params.id, specialistId)
    if (!Array.isArray(check) || check.length === 0) return notFound()
    inMyGroup = true
    hasAccess = Boolean(check[0].diaryAccessGranted)
    const groupInfo = check[0]

    const users = await (prisma as any).$queryRawUnsafe(
      `SELECT id, name, email, image, role FROM "User" WHERE id = ? LIMIT 1`, params.id
    )
    if (!users.length) return notFound()
    client = { ...users[0], groupTitle: groupInfo.groupTitle, currentWeek: groupInfo.currentWeek }

    if (hasAccess) {
      const raw = await (prisma as any).$queryRawUnsafe(
        `SELECT id, date, type, mood, anxiety, urgeToWrite, energy, sleep, triggers, helpers, note, nextStep, sharedWithSpecialist, createdAt
         FROM "JournalEntry" WHERE userId = ?
         ORDER BY createdAt DESC LIMIT 20`,
        params.id
      )
      journals = Array.isArray(raw) ? raw : []
    }

    const rawNotes = await (prisma as any).$queryRawUnsafe(
      `SELECT id, note, tags, isImportant, createdAt FROM "SpecialistNote"
       WHERE specialistId = ? AND userId = ? ORDER BY createdAt DESC`,
      specialistId, params.id
    )
    notes = Array.isArray(rawNotes) ? rawNotes : []
  } catch { /* DB not ready */ }

  if (!client) return notFound()

  const initials = client.name
    ? client.name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
    : client.email[0].toUpperCase()

  const moodAvg = journals.length
    ? Math.round(journals.reduce((s: number, j: any) => s + (j.mood ?? 5), 0) / journals.length)
    : null

  return (
    <div style={{ maxWidth: '52rem' }}>
      <Link href="/specialist/clients" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1.5rem' }}>
        <ArrowLeft size={13} /> Все участники
      </Link>

      {/* Header */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
        <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.1rem', fontWeight: 700, color: 'white', overflow: 'hidden' }}>
          {client.image ? <img src={client.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>{client.name || client.email}</h1>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>{client.groupTitle}</span>
            <span>Неделя {client.currentWeek} из 4</span>
            <span style={{ color: hasAccess ? 'var(--primary)' : 'var(--text-light)', fontWeight: 600 }}>
              {hasAccess ? '✓ Дневник открыт' : 'Дневник закрыт'}
            </span>
          </div>
        </div>
        {moodAvg != null && (
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: moodAvg <= 3 ? '#DC2626' : moodAvg <= 5 ? '#D97706' : '#059669' }}>{moodAvg}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>ср. состояние</div>
          </div>
        )}
      </div>

      {/* Journals */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <FileText size={16} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>Дневник</h2>
        </div>

        {!hasAccess ? (
          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
            <Lock size={28} style={{ margin: '0 auto 0.75rem', color: 'var(--text-light)' }} />
            <p style={{ fontSize: '0.875rem', margin: '0 0 1rem' }}>
              Участник не открыл доступ к дневнику.
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
              Вы можете попросить участника открыть доступ в разделе настроек дневника.
            </p>
          </div>
        ) : journals.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1.5rem 0' }}>
            Записей в дневнике пока нет.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {journals.slice(0, 7).map((j: any) => (
              <div key={j.id} style={{ background: 'var(--bg-soft)', borderRadius: '0.75rem', padding: '0.875rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {new Date(j.date).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </span>
                  {j.sharedWithSpecialist && (
                    <span style={{ fontSize: '0.68rem', color: 'var(--primary)', fontWeight: 600 }}>отправлено вам</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                  {[
                    { label: 'Состояние', val: j.mood },
                    { label: 'Тревога', val: j.anxiety },
                    { label: 'Желание написать', val: j.urgeToWrite },
                    { label: 'Энергия', val: j.energy },
                  ].map(({ label, val }) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: val <= 3 ? '#DC2626' : val <= 5 ? '#D97706' : '#059669' }}>{val}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-light)' }}>{label}</div>
                    </div>
                  ))}
                </div>
                {j.note && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.5rem 0 0', lineHeight: 1.5 }}>
                    {j.note}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Internal notes */}
      <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Star size={16} style={{ color: 'var(--primary)' }} />
          <h2 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>Внутренние заметки</h2>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
          Видны только вам и администратору. Участник не видит эти заметки.
        </p>

        <AddNoteForm userId={params.id} />

        {notes.length > 0 && (
          <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {notes.map((n: any) => (
              <div key={n.id} style={{ background: n.isImportant ? '#FFFBEB' : 'var(--bg-soft)', border: n.isImportant ? '1px solid #FDE68A' : 'none', borderRadius: '0.75rem', padding: '0.875rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.375rem' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-light)' }}>
                    {new Date(n.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {n.isImportant && ' · ⭐ Важно'}
                  </span>
                  {n.tags && <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{n.tags}</span>}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--text)', margin: 0, lineHeight: 1.6 }}>{n.note}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendations link */}
      <Link href={`/specialist/recommendations?userId=${params.id}`} style={{ textDecoration: 'none', display: 'block' }}>
        <div className="card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem', background: 'var(--bg-sage)', border: '1px solid var(--primary-light)' }}>
          <Calendar size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text)' }}>Оставить рекомендацию</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>После встречи или просмотра дневника</div>
          </div>
          <ArrowLeft size={14} style={{ color: 'var(--primary)', transform: 'rotate(180deg)', flexShrink: 0 }} />
        </div>
      </Link>
    </div>
  )
}
