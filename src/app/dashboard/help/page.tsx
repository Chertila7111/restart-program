import Link from 'next/link'
import { FAQ_ITEMS } from '@/lib/dashboard-data'
import { HelpFaq } from './HelpFaq'

export default function HelpPage() {
  return (
    <div style={{ maxWidth: '44rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.375rem' }}>Помощь</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Частые вопросы и способы связаться с нами</p>

      <HelpFaq items={FAQ_ITEMS} />

      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>✉️</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.2rem' }}>Написать нам</div>
            <a href="mailto:support@restart-program.ru" style={{ fontSize: '0.825rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
              support@restart-program.ru
            </a>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Отвечаем в течение суток</div>
          </div>
        </div>
        <div className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>💬</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.2rem' }}>Написать психологу</div>
            <Link href="/dashboard/chats" style={{ fontSize: '0.825rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
              Открыть чат →
            </Link>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Пн–пт, 10:00–19:00 МСК</div>
          </div>
        </div>
      </div>
    </div>
  )
}
