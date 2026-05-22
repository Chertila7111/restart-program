import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { LogoSvg } from '@/components/LogoSvg'

export const metadata: Metadata = {
  title: 'Не могу отпустить человека после расставания — помощь | Снова с собой',
  description: 'Прошло несколько месяцев, но всё равно не можете отпустить? Это не слабость — это сигнал, что есть что-то незавершённое. Программа помогает разобраться.',
  keywords: ['не могу отпустить человека', 'помощь не отпускаю после расставания', 'как отпустить бывшего психолог', 'застряла после расставания'],
  openGraph: {
    title: 'Не могу отпустить — помощь психолога',
    description: 'Застряли после расставания? Разбираемся, что держит, и находим путь вперёд — с психологом и группой.',
  },
}

const holds = [
  { title: 'Надежда на возврат', desc: 'Внутри живёт «а вдруг вернётся» — и из-за этого невозможно двигаться вперёд.' },
  { title: 'Незакрытые вопросы', desc: 'Что-то важное не было сказано или понято. Мозг продолжает «жевать» ситуацию.' },
  { title: 'Потеря себя', desc: 'В отношениях человек «растворился» — теперь непонятно, кем быть без этого человека.' },
  { title: 'Страх одиночества', desc: 'Держится не за конкретного человека, а за ощущение не быть одному.' },
  { title: 'Вина', desc: 'Кажется, нужно сначала «исправить» или «искупить» — тогда можно будет отпустить.' },
]

export default function SupportNeOtpustitPage() {
  return (
    <>
      {/* Hero */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-5rem', right: '-5rem', width: '24rem', height: '24rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)', fontSize: '0.78rem', fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            Не могу отпустить
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            «Просто отпусти» — плохой совет.<br />Отпускание — это процесс, не решение.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '40rem' }}>
            Если прошло несколько месяцев, а что-то всё равно держит — это не слабость. Это сигнал, что есть что-то незавершённое. Важно найти, что именно.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/checkout?product=intro" className="btn-ghost-dark" style={{ fontSize: '1rem' }}>
              Записаться на вводную встречу — 1 490 ₽
            </Link>
            <Link href="/quiz" style={{ color: 'rgba(168,184,160,0.8)', textDecoration: 'none', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center' }}>
              Пройти тест →
            </Link>
          </div>
        </div>
      </section>

      {/* What holds */}
      <section style={{ background: 'var(--bg-soft)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            Что чаще всего не даёт отпустить
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Когда знаешь, что держит — можно начать с этим работать. Называние удерживает меньше, чем неопределённость.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {holds.map((h) => (
              <div key={h.title} className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <CheckCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '0.15rem' }} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem', fontSize: '0.95rem' }}>{h.title}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What helps */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
            Как помогает программа
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Отпускание нельзя форсировать. Но можно создать условия, в которых оно происходит — постепенно и устойчиво.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '1.25rem' }}>
            {[
              { title: 'Найти, что именно держит', desc: 'Психолог помогает назвать — надежда, вина, страх, незакрытость — и начать работу именно с этим.' },
              { title: 'Дать горю место', desc: 'Не форсировать «отпускание», а прожить то, что не было прожито. Безопасно и в своём темпе.' },
              { title: 'Восстановить своё «я»', desc: 'Найти ответ: кем я был(а) до этих отношений и кем хочу быть дальше.' },
              { title: 'Строить жизнь параллельно', desc: 'Когда появляются новые точки опоры — место, которое занимал человек, перестаёт быть таким пустым.' },
            ].map((item) => (
              <div key={item.title} className="card" style={{ padding: '1.5rem' }}>
                <div style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{item.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0' }}>
        <div className="container mx-auto px-6" style={{ textAlign: 'center', maxWidth: '40rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <LogoSvg size={64} />
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'white', marginBottom: '0.875rem', lineHeight: 1.3 }}>
            Начните с вводной встречи
          </h2>
          <p style={{ color: 'rgba(168,184,160,1)', marginBottom: '2rem', fontSize: '1rem', lineHeight: 1.7 }}>
            90 минут в небольшой группе с психологом. Без осуждения и давления. Можно просто слушать.
          </p>
          <Link href="/checkout?product=intro" className="btn-ghost-dark">
            Записаться — 1 490 ₽ →
          </Link>
        </div>
      </section>

      {/* Related */}
      <section style={{ background: 'var(--bg)', padding: '4rem 0 5rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <h2 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--text)', marginBottom: '1.25rem' }}>Читайте также</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { href: '/blog/pochemu-ne-mogu-otpustit-cheloveka', title: 'Почему не могу отпустить человека после расставания' },
              { href: '/blog/kak-ne-budit-nadezhdu-na-vozvrat', title: 'Надежда на возврат: как перестать ждать' },
              { href: '/blog/kak-zabyt-byvshego', title: 'Как забыть бывшего, если мысли всё равно возвращаются' },
            ].map((a) => (
              <Link key={a.href} href={a.href} style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.9rem' }}>
                → {a.title}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
