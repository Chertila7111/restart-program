import type { Metadata } from 'next'
import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog'
import { Clock, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Блог о расставаниях и восстановлении — Restart',
  description: 'Статьи психологов о том, как пережить расставание, вернуть уверенность в себе и начать новую жизнь после разрыва.',
}

export default function BlogPage() {
  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #F5F3FF 0%, #FCE7F3 100%)', padding: '5rem 0 3rem' }}>
        <div className="container mx-auto px-6">
          <span className="badge" style={{ background: '#EDE9FE', color: '#7C3AED', marginBottom: '1.5rem', display: 'inline-flex' }}>Блог</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: '#1F1535', marginBottom: '1rem', marginTop: '0.5rem' }}>
            Статьи о расставаниях<br />и восстановлении
          </h1>
          <p style={{ color: '#6B7280', fontSize: '1.125rem', maxWidth: '36rem' }}>
            Материалы от психологов и специалистов Restart — честно, без банальностей
          </p>
        </div>
      </section>

      <section className="section" style={{ background: '#FEFBF8' }}>
        <div className="container mx-auto px-6">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))', gap: '2rem' }}>
            {BLOG_POSTS.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ padding: 0, overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}>
                  {/* Thumbnail */}
                  <div
                    style={{
                      height: '10rem',
                      background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '1.5rem',
                    }}
                  >
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.8rem' }}>
                      {post.category}
                    </span>
                  </div>

                  <div style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#9CA3AF', marginBottom: '0.75rem', alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Clock size={12} /> {post.readTime} мин
                      </span>
                      <span>{new Date(post.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}</span>
                    </div>
                    <h2 style={{ fontWeight: 700, color: '#1F1535', fontSize: '1.1rem', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                      {post.title}
                    </h2>
                    <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                      {post.excerpt}
                    </p>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#7C3AED', fontWeight: 600, fontSize: '0.875rem' }}>
                      Читать <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 0', background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)' }}>
        <div className="container mx-auto px-6" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', marginBottom: '1rem' }}>
            Готовы начать восстановление?
          </h2>
          <p style={{ color: '#EDE9FE', marginBottom: '2rem' }}>Статьи помогают понять. Программа помогает изменить.</p>
          <Link href="/pricing" className="btn-accent">Начать программу →</Link>
        </div>
      </section>
    </>
  )
}
