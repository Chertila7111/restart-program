import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BLOG_POSTS, getPost } from '@/lib/blog'
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react'

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.seoTitle,
    description: post.seoDescription,
    keywords: post.keywords,
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      type: 'article',
      publishedTime: post.publishedAt,
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const others = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #1F1535 0%, #3B1D6B 100%)', padding: '5rem 0 3rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: '#A78BFA', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            <ArrowLeft size={14} /> Все статьи
          </Link>
          <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#DDD6FE', display: 'inline-flex', marginBottom: '1rem' }}>{post.category}</span>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: '1.5rem', lineHeight: 1.2 }}>
            {post.title}
          </h1>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#A78BFA', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Clock size={14} /> {post.readTime} минут чтения
            </span>
            <span>{new Date(post.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section" style={{ background: '#FEFBF8' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(0, 3fr)', gap: '3rem' }}>
            {/* Main content */}
            <div style={{ gridColumn: '1 / -1' }}>
              <div
                className="prose"
                style={{ maxWidth: 'none' }}
                dangerouslySetInnerHTML={{
                  __html: post.content
                    .replace(/\n## /g, '<h2>')
                    .replace(/\n### /g, '<h3>')
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/<h2>(.*?)\n/g, '</p><h2>$1</h2><p>')
                    .replace(/<h3>(.*?)\n/g, '</p><h3>$1</h3><p>')
                    .replace(/^/, '<p>')
                    .replace(/$/, '</p>')
                }}
              />
            </div>
          </div>

          {/* Keywords */}
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #E5E7EB' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {post.keywords.map((k) => (
                <span key={k} className="badge" style={{ background: '#EDE9FE', color: '#7C3AED', fontSize: '0.8rem' }}>{k}</span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div
            className="card"
            style={{ padding: '2.5rem', marginTop: '3rem', background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)', border: 'none', textAlign: 'center' }}
          >
            <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.5rem', marginBottom: '0.75rem' }}>
              Статья помогла? Пора двигаться дальше.
            </h3>
            <p style={{ color: '#EDE9FE', marginBottom: '1.5rem' }}>
              Программа Restart даёт не только понимание, но и конкретный путь. Психолог, группа и план восстановления.
            </p>
            <Link href="/pricing" className="btn-accent">Начать программу →</Link>
          </div>
        </div>
      </section>

      {/* Other posts */}
      {others.length > 0 && (
        <section className="section" style={{ background: '#F5F3FF' }}>
          <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.5rem', color: '#1F1535', marginBottom: '1.5rem' }}>Читать также</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))', gap: '1.5rem' }}>
              {others.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '1.5rem' }}>
                    <span className="badge" style={{ background: '#EDE9FE', color: '#7C3AED', fontSize: '0.75rem', marginBottom: '0.75rem', display: 'inline-flex' }}>{p.category}</span>
                    <h3 style={{ fontWeight: 700, color: '#1F1535', marginBottom: '0.5rem', fontSize: '0.95rem' }}>{p.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#7C3AED', fontWeight: 600, fontSize: '0.875rem', marginTop: '0.75rem' }}>
                      Читать <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
