import Link from 'next/link'
import { Check, X } from 'lucide-react'

const SECTIONS = [
  {
    title: 'Топик-хабы',
    color: '#5B7FA6',
    pages: [
      { path: '/topics/rasstavanie',              title: 'Расставание',             meta: true, schema: true, internal: true },
      { path: '/topics/razvod',                   title: 'Развод',                  meta: true, schema: true, internal: true },
      { path: '/topics/emotsionalnaya-zavisimost',title: 'Эмоциональная зависимость',meta: true, schema: true, internal: true },
    ],
  },
  {
    title: 'Страницы поддержки',
    color: 'var(--primary)',
    pages: [
      { path: '/support/posle-rasstavaniya',              title: 'Поддержка: расставание',        meta: true, schema: true, internal: true },
      { path: '/support/posle-razvoda',                   title: 'Поддержка: развод',             meta: true, schema: true, internal: true },
      { path: '/support/emotsionalnaya-zavisimost',       title: 'Поддержка: эмоц. завис.',       meta: true, schema: true, internal: true },
      { path: '/support/ne-mogu-otpustit',                title: 'Поддержка: не могу отпустить',  meta: true, schema: false, internal: true },
    ],
  },
  {
    title: 'Страницы сравнения',
    color: '#7A6BA0',
    pages: [
      { path: '/compare/gruppa-ili-psiholog',             title: 'Группа или психолог',           meta: true, schema: true, internal: true },
      { path: '/compare/kakaya-podderzhka-podoydet',      title: 'Какая поддержка подойдёт',      meta: true, schema: false, internal: true },
      { path: '/compare/besplatnye-gruppy-ili-programma', title: 'Бесплатные группы vs программа',meta: true, schema: false, internal: true },
    ],
  },
  {
    title: 'Бесплатные инструменты',
    color: '#2E8B57',
    pages: [
      { path: '/tools/pauza-10-minut',            title: 'Пауза 10 минут',          meta: true, schema: false, internal: true },
      { path: '/tools/dnevnik-sostoyaniya',        title: 'Дневник состояния',       meta: true, schema: false, internal: false },
      { path: '/tools/test-stadiya-rasstavaniya',  title: 'Тест: стадия расставания',meta: true, schema: false, internal: false },
      { path: '/tools/chto-delat-segodnya',        title: 'Что делать сегодня',      meta: true, schema: false, internal: false },
    ],
  },
  {
    title: 'Блог (ключевые статьи)',
    color: '#C0392B',
    pages: [
      { path: '/blog/kak-perezhit-rasstavanie',           title: 'Как пережить расставание',      meta: true, schema: true, internal: true },
      { path: '/blog/kak-ne-napisat-byvshemu',            title: 'Как не написать бывшему',       meta: true, schema: true, internal: true },
      { path: '/blog/kak-perezhit-razvod',                title: 'Как пережить развод',           meta: true, schema: true, internal: true },
      { path: '/blog/emotsionalnaya-zavisimost-v-otnosheniyakh', title: 'Эмоц. зависимость',     meta: true, schema: true, internal: true },
      { path: '/blog/pochemu-ne-mogu-otpustit-cheloveka', title: 'Почему не могу отпустить',      meta: true, schema: true, internal: true },
    ],
  },
]

type Bool3 = { meta: boolean; schema: boolean; internal: boolean }

function Indicator({ ok }: { ok: boolean }) {
  return ok
    ? <Check size={13} style={{ color: '#2E8B57', flexShrink: 0 }} />
    : <X size={13} style={{ color: '#C0392B', flexShrink: 0 }} />
}

export default function ContentMapPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', padding: '3rem 1.5rem' }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
            DEV ONLY
          </div>
          <h1 style={{ fontWeight: 800, fontSize: '1.5rem', color: '#1a1a1a', marginBottom: '0.5rem' }}>
            Карта контента
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            Статус всех SEO-страниц: метаданные, структурированные данные, внутренние ссылки.
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', fontSize: '0.8rem', color: '#666' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Check size={13} style={{ color: '#2E8B57' }} /> Есть</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}><X size={13} style={{ color: '#C0392B' }} /> Нет</span>
        </div>

        {SECTIONS.map(section => (
          <div key={section.title} style={{ marginBottom: '2rem', background: 'white', borderRadius: '1rem', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: section.color, flexShrink: 0 }} />
              <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1a1a1a' }}>{section.title}</span>
              <span style={{ fontSize: '0.75rem', color: '#888', marginLeft: '0.25rem' }}>{section.pages.length} страниц</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ textAlign: 'left', padding: '0.625rem 1.25rem', fontWeight: 600, color: '#555', width: '40%' }}>Страница</th>
                  <th style={{ textAlign: 'left', padding: '0.625rem', fontWeight: 600, color: '#555', width: '30%' }}>URL</th>
                  <th style={{ textAlign: 'center', padding: '0.625rem', fontWeight: 600, color: '#555', width: '10%' }}>Meta</th>
                  <th style={{ textAlign: 'center', padding: '0.625rem', fontWeight: 600, color: '#555', width: '10%' }}>Schema</th>
                  <th style={{ textAlign: 'center', padding: '0.625rem', fontWeight: 600, color: '#555', width: '10%' }}>Ссылки</th>
                </tr>
              </thead>
              <tbody>
                {section.pages.map((page, i) => (
                  <tr key={page.path} style={{ borderTop: '1px solid #f3f4f6', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <td style={{ padding: '0.625rem 1.25rem', color: '#222', fontWeight: 500 }}>{page.title}</td>
                    <td style={{ padding: '0.625rem' }}>
                      <Link href={page.path} target="_blank" style={{ color: section.color, fontSize: '0.775rem', textDecoration: 'none', fontFamily: 'monospace' }}>
                        {page.path}
                      </Link>
                    </td>
                    <td style={{ padding: '0.625rem', textAlign: 'center' }}><Indicator ok={page.meta} /></td>
                    <td style={{ padding: '0.625rem', textAlign: 'center' }}><Indicator ok={page.schema} /></td>
                    <td style={{ padding: '0.625rem', textAlign: 'center' }}><Indicator ok={page.internal} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

        <div style={{ marginTop: '2rem', padding: '1rem 1.25rem', background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '0.75rem', fontSize: '0.8rem', color: '#92400e' }}>
          <strong>Заметки по незакрытым позициям:</strong>
          <ul style={{ marginTop: '0.5rem', marginLeft: '1rem', lineHeight: 1.8 }}>
            <li>Дневник / Тест / Что делать — нет перекрёстных ссылок с блогом (добавить в relatedSlugs)</li>
            <li>Страница поддержки ne-mogu-otpustit — нет FaqSchema (добавить 2–3 вопроса)</li>
            <li>Compare-страницы — нет schema (низкий приоритет)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
