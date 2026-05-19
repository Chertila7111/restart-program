import { HelpCircle, Mail } from 'lucide-react'

export default function SpecialistHelpPage() {
  return (
    <div style={{ maxWidth: '44rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.25rem' }}>Помощь</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Контакты поддержки и инструкции</p>
      </div>

      {[
        { q: 'Как добавить участника в группу?', a: 'Обратитесь к администратору. Назначение участников в группы происходит через административную панель.' },
        { q: 'Что делать, если участнику стало резко хуже?', a: 'Немедленно свяжитесь с администратором. Не оставляйте участника без поддержки. При кризисных ситуациях рекомендуйте обратиться на горячую линию психологической помощи.' },
        { q: 'Как участник может дать мне доступ к дневнику?', a: 'Участник самостоятельно открывает доступ в настройках дневника. Вы не можете запросить доступ в обход его согласия.' },
        { q: 'Могу ли я редактировать профиль после публикации?', a: 'Да, в любое время через раздел «Мой профиль».' },
        { q: 'Кто видит мои внутренние заметки?', a: 'Только вы и администратор. Участник не имеет доступа к внутренним заметкам.' },
      ].map(({ q, a }) => (
        <div key={q} className="card" style={{ padding: '1.25rem', marginBottom: '0.875rem' }}>
          <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <HelpCircle size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.1rem' }} />
            {q}
          </div>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.6, paddingLeft: '1.5rem' }}>{a}</p>
        </div>
      ))}

      <div className="card" style={{ padding: '1.25rem', background: 'var(--bg-sage)', border: '1px solid var(--primary-light)' }}>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Mail size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)', marginBottom: '0.15rem' }}>Служба поддержки</div>
            <a href="mailto:snovassoboi@yandex.com" style={{ fontSize: '0.825rem', color: 'var(--primary)', textDecoration: 'none' }}>
              snovassoboi@yandex.com
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
