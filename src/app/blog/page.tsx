import type { Metadata } from 'next'
import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog'
import { Clock, ArrowRight } from 'lucide-react'
import { LighthouseIcon } from '@/components/LighthouseIcon'

export const metadata: Metadata = {
  title: 'Блог о расставаниях и восстановлении — Restart',
  description: 'Статьи психологов о том, как пережить расставание, вернуть уверенность в себе и начать новую жизнь после разрыва.',
}

const categoryColor: Record<string, string> = {
  'Восстановление': 'var(--primary)',
  'Психология': 'var(--secondary)',
  'Практика': '#5B7FA6',
  'Самооценка': '#7A6BA0',
}
const categoryBg: Record<string, string> = {
  'Восстановление': 'var(--primary-light)',
  'Психология': 'var(--secondary-light)',
  'Практика': '#D6E4F0',
  'Самооценка': '#E8E4F0',
}

function getColor(cat: string) { return categoryColor[cat] ?? 'var(--primary)' }
function getBg(cat: string) { return categoryBg[cat] ?? 'var(--primary-light)' }

export default function BlogPage() {
  const featured = BLOG_POSTS[0]
  const rest = BLOG_POSTS.slice(1)
  const categories = ['Все', ...Array.from(new Set(BLOG_POSTS.map((p) => p.category)))]

  return (
    <>
      {/* Header */}
      <section style={{ background: 'var(--bg-soft)', padding: '5rem 0 2rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '72rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'var(--primary-light)', fontSize: '0.78rem', fontWeight: 600, color: 'var(--primary-dark)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.75rem' }}>
            Материалы
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '0.875rem', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            Статьи о расставании<br />и восстановлении
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '36rem', lineHeight: 1.7 }}>
            От психологов и команды Restart — честно, без банальностей и пустых советов
          </p>
        </div>
      </section>

      {/* Featured article */}
      <section style={{ background: 'white', padding: '2.5rem 0 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '72rem' }}>
          <Link href={`/blog/${featured.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 0.9fr) minmax(0, 1.1fr)',
              borderRadius: '1.5rem',
              overflow: 'hidden',
              border: '1.5px solid var(--border)',
              minHeight: '320px',
              transition: 'box-shadow 0.2s',
            }}>
              {/* Left visual */}
              <div style={{
                background: 'var(--bg-sage)',
                padding: '3rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}>
                <div style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '14rem', height: '14rem', borderRadius: '50%', background: 'var(--primary-light)', opacity: 0.7 }} />
                <div style={{ position: 'absolute', bottom: '-2rem', left: '-2rem', width: '10rem', height: '10rem', borderRadius: '50%', background: 'var(--primary)', opacity: 0.1 }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'inline-flex', padding: '0.35rem 0.875rem', background: 'var(--primary)', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
                    Рекомендуем
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-dark)', background: getBg(featured.category), padding: '0.25rem 0.75rem', borderRadius: '9999px', display: 'inline-block' }}>
                    {featured.category}
                  </div>
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--primary-dark)' }}>
                    <Clock size={14} />
                    {featured.readTime} минут чтения
                  </div>
                </div>
              </div>

              {/* Right content */}
              <div style={{ padding: '3rem', background: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', fontWeight: 800, color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                    {featured.title}
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.975rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                    {featured.excerpt}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.975rem' }}>
                    Читать статью <ArrowRight size={16} />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>
                    {new Date(featured.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Category pills */}
      <section style={{ background: 'white', padding: '2rem 0 0' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '72rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
            {categories.map((cat, i) => (
              <span key={cat} style={{
                padding: '0.4rem 1rem',
                borderRadius: '9999px',
                fontSize: '0.825rem',
                fontWeight: i === 0 ? 700 : 500,
                background: i === 0 ? 'var(--primary)' : 'var(--bg-sage)',
                color: i === 0 ? 'white' : 'var(--text-muted)',
                cursor: 'default',
              }}>
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Articles grid */}
      <section style={{ background: 'var(--bg)', padding: '2.5rem 0 5rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '72rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 22rem), 1fr))', gap: '1.5rem' }}>
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="card" style={{ padding: 0, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {/* Category color bar */}
                  <div style={{ height: '4px', background: getColor(post.category) }} />

                  <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 700,
                        padding: '0.2rem 0.625rem', borderRadius: '9999px',
                        background: getBg(post.category),
                        color: getColor(post.category),
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                      }}>
                        {post.category}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-light)', fontSize: '0.78rem' }}>
                        <Clock size={12} /> {post.readTime} мин
                      </span>
                    </div>

                    <h3 style={{ fontWeight: 700, color: 'var(--text)', fontSize: '1.05rem', marginBottom: '0.625rem', lineHeight: 1.4, flex: 0 }}>
                      {post.title}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '1.5rem', flex: 1 }}>
                      {post.excerpt}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: getColor(post.category), fontWeight: 600, fontSize: '0.875rem' }}>
                        Читать <ArrowRight size={14} />
                      </div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-light)' }}>
                        {new Date(post.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0' }}>
        <div className="container mx-auto px-6" style={{ textAlign: 'center', maxWidth: '44rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <LighthouseIcon size={40} color="rgba(255,255,255,0.9)" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 800, color: 'white', marginBottom: '1rem', lineHeight: 1.3 }}>
            Статьи помогают понять.<br />Программа помогает изменить.
          </h2>
          <p style={{ color: 'rgba(168,184,160,1)', marginBottom: '2rem', fontSize: '1.05rem', lineHeight: 1.7 }}>
            4 недели с психологом, группой и конкретными практиками. Начните с короткого теста.
          </p>
          <Link href="/quiz" className="btn-ghost-dark">
            Пройти короткий тест →
          </Link>
        </div>
      </section>
    </>
  )
}
