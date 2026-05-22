import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { LogoSvg } from '@/components/LogoSvg'
import { BreadcrumbSchema, FaqSchema } from '@/components/JsonLd'
import { BLOG_POSTS } from '@/lib/blog'

export type TopicHubConfig = {
  slug: string
  h1: string
  intro: string
  what: string        // one-paragraph "what is this topic" block
  supportUrl: string
  supportLabel: string
  articleSlugs: string[]
  faq: { q: string; a: string }[]
}

const categoryColor: Record<string, string> = {
  'Восстановление': 'var(--primary)',
  'Психология':    'var(--secondary)',
  'Практика':      '#5B7FA6',
  'Самооценка':    '#7A6BA0',
}
const categoryBg: Record<string, string> = {
  'Восстановление': 'var(--primary-light)',
  'Психология':    'var(--secondary-light)',
  'Практика':      '#D6E4F0',
  'Самооценка':    '#E8E4F0',
}

export default function TopicHub({ hub }: { hub: TopicHubConfig }) {
  const articles = hub.articleSlugs
    .map(s => BLOG_POSTS.find(p => p.slug === s))
    .filter(Boolean) as typeof BLOG_POSTS

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Главная', href: '/' },
        { name: 'Темы', href: '/topics' },
        { name: hub.h1, href: `/topics/${hub.slug}` },
      ]} />
      {hub.faq.length > 0 && <FaqSchema items={hub.faq} />}

      {/* Hero */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0 3.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: '20rem', height: '20rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div style={{ position: 'absolute', bottom: '-3rem', left: '8%', width: '12rem', height: '12rem', borderRadius: '50%', background: 'rgba(78,123,94,0.07)' }} />
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb visual */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Главная</Link>
            <span>/</span>
            <Link href="/blog" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>Материалы</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{hub.h1}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: '1.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
            {hub.h1}
          </h1>
          <p style={{ color: 'rgba(168,184,160,0.9)', fontSize: '1.05rem', lineHeight: 1.75, maxWidth: '40rem' }}>
            {hub.intro}
          </p>
        </div>
      </section>

      {/* Main content */}
      <section style={{ background: 'var(--bg)', padding: '3.5rem 0 5rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>

          {/* What block */}
          <div style={{ background: 'var(--bg-sage)', border: '1px solid var(--primary-light)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '2.5rem', display: 'flex', gap: '0.875rem' }}>
            <div style={{ flexShrink: 0, marginTop: '0.1rem' }}><LogoSvg size={28} /></div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.75, margin: 0 }}>{hub.what}</p>
          </div>

          {/* Articles */}
          <h2 style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '1.25rem' }}>
            Статьи по теме
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '1rem', marginBottom: '3rem' }}>
            {articles.map(post => {
              const color = categoryColor[post.category] ?? 'var(--primary)'
              const bg    = categoryBg[post.category]   ?? 'var(--primary-light)'
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: 0, overflow: 'hidden', height: '100%', transition: 'transform 0.15s, box-shadow 0.15s' }}>
                    <div style={{ height: '3px', background: color }} />
                    <div style={{ padding: '1.25rem' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px', background: bg, color, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'inline-block', marginBottom: '0.75rem' }}>
                        {post.category}
                      </span>
                      <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.625rem', fontSize: '0.925rem', lineHeight: 1.45 }}>
                        {post.title}
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '0.875rem' }}>
                        {post.excerpt.slice(0, 120)}…
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                          <Clock size={12} /> {post.readTime} мин
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color, fontWeight: 600, fontSize: '0.8rem' }}>
                          Читать <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Support page CTA */}
          <div style={{ background: 'var(--bg-sage)', border: '2px solid var(--primary)', borderRadius: '1.25rem', padding: '1.75rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--primary-dark)', marginBottom: '0.375rem' }}>{hub.supportLabel}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Психолог + небольшая группа + 4 недели. Можно начать с вводной встречи — без обязательств.
              </div>
            </div>
            <Link href={hub.supportUrl} style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              Узнать подробнее <ArrowRight size={14} />
            </Link>
          </div>

          {/* FAQ */}
          {hub.faq.length > 0 && (
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text)', marginBottom: '1rem' }}>Частые вопросы</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {hub.faq.map((item, i) => (
                  <div key={i} style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '1rem', padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.925rem', marginBottom: '0.5rem' }}>{item.q}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>{item.a}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dual CTA */}
          <div style={{ background: 'var(--bg-dark)', borderRadius: '1.5rem', padding: '2.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '12rem', height: '12rem', borderRadius: '50%', background: 'rgba(78,123,94,0.15)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><LogoSvg size={52} /></div>
              <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.3rem', marginBottom: '0.625rem', lineHeight: 1.3 }}>
                Не нужно разбираться с этим в одиночку
              </h3>
              <p style={{ color: 'rgba(168,184,160,0.85)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: 1.7 }}>
                90 минут в небольшой группе с психологом. Можно просто слушать. Без обязательства покупать программу.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/checkout?product=intro" className="btn-ghost-dark">Записаться — 1 490 ₽ →</Link>
                <Link href="/quiz" style={{ color: 'rgba(168,184,160,0.7)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  Пройти тест <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
