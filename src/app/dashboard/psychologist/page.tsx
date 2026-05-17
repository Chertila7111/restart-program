import Link from 'next/link'
import { CheckCircle, MessageCircle } from 'lucide-react'

const PSYCHOLOGIST = {
  name: 'Мария Соколова',
  title: 'Клинический психолог',
  approach: 'КПТ и схема-терапия',
  education: 'МГУ, факультет психологии · Сертификат КПТ (Beck Institute)',
  experience: '9 лет практики · 300+ индивидуальных клиентов · 4 года ведения групп',
  groupExperience: 'Ведёт группы поддержки с 2021 года, специализируется на работе с потерями и переходными периодами.',
  requests: [
    'Расставания и разводы',
    'Восстановление самооценки',
    'Тревога и навязчивые мысли',
    'Одиночество и изоляция',
    'Поиск смыслов после утраты',
  ],
  quote: 'Боль после расставания — это не слабость. Это цена за то, что вы умеете любить. Моя задача — помочь вам пройти через неё, не разрушив себя.',
  color: '#4E7B5E',
}

export default function PsychologistPage() {
  return (
    <div style={{ maxWidth: '44rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Психолог</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Ведущий специалист вашей программы</p>

      <div className="card" style={{ padding: '2rem', marginBottom: '1.25rem' }}>
        {/* Avatar + name */}
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{
            width: '4rem', height: '4rem', borderRadius: '50%',
            background: PSYCHOLOGIST.color, display: 'flex', alignItems: 'center',
            justifyContent: 'center', flexShrink: 0,
            fontSize: '1.4rem', fontWeight: 800, color: 'white',
          }}>
            {PSYCHOLOGIST.name[0]}
          </div>
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--text)', marginBottom: '0.25rem' }}>
              {PSYCHOLOGIST.name}
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{PSYCHOLOGIST.title}</div>
            <span style={{
              display: 'inline-flex', padding: '0.25rem 0.75rem', borderRadius: '9999px',
              background: 'var(--primary-light)', color: 'var(--primary-dark)',
              fontSize: '0.75rem', fontWeight: 700,
            }}>
              {PSYCHOLOGIST.approach}
            </span>
          </div>
        </div>

        {/* Quote */}
        <blockquote style={{
          margin: '0 0 1.5rem', padding: '1rem 1.25rem',
          background: 'var(--bg-sage)', borderLeft: '3px solid var(--primary)',
          borderRadius: '0 0.75rem 0.75rem 0',
          fontSize: '0.9rem', color: 'var(--primary-dark)', lineHeight: 1.7,
          fontStyle: 'normal', fontWeight: 500,
        }}>
          «{PSYCHOLOGIST.quote}»
        </blockquote>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
              Образование
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>{PSYCHOLOGIST.education}</p>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
              Опыт
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>{PSYCHOLOGIST.experience}</p>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
              С чем работает
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              {PSYCHOLOGIST.requests.map(r => (
                <div key={r} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <CheckCircle size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{r}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.375rem' }}>
              Опыт ведения групп
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0 }}>{PSYCHOLOGIST.groupExperience}</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <MessageCircle size={16} style={{ color: 'var(--primary)' }} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)', marginBottom: '0.25rem' }}>Вопросы психологу</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0 0 0.875rem', lineHeight: 1.6 }}>
            Во время встреч можно задавать вопросы напрямую. Между встречами — пишите куратору, и вопрос будет передан.
          </p>
          <Link href="/dashboard/chats" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.8rem', textDecoration: 'none' }}>
            Написать куратору →
          </Link>
        </div>
      </div>
    </div>
  )
}
