import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BLOG_POSTS, getPost } from '@/lib/blog'
import { Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import { LogoSvg } from '@/components/LogoSvg'
import { ArticleReader } from '@/components/ArticleReader'
import { ArticleSchema, BreadcrumbSchema } from '@/components/JsonLd'

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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const others = post.relatedSlugs
    ? post.relatedSlugs.map(s => BLOG_POSTS.find(p => p.slug === s)).filter((p): p is typeof BLOG_POSTS[0] => !!p)
    : BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3)

  return (
    <>
      <ArticleSchema title={post.seoTitle} description={post.seoDescription} publishedAt={post.publishedAt} slug={post.slug} />
      <BreadcrumbSchema items={[{ name: 'Главная', href: '/' }, { name: 'Блог', href: '/blog' }, { name: post.title, href: `/blog/${post.slug}` }]} />
      {/* Hero */}
      <section style={{ background: 'var(--bg-dark)', padding: '5rem 0 3.5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-4rem', right: '-4rem', width: '20rem', height: '20rem', borderRadius: '50%', background: 'rgba(78,123,94,0.12)' }} />
        <div style={{ position: 'absolute', bottom: '-3rem', left: '10%', width: '12rem', height: '12rem', borderRadius: '50%', background: 'rgba(78,123,94,0.07)' }} />

        <div className="container mx-auto px-6" style={{ maxWidth: '52rem', position: 'relative', zIndex: 1 }}>
          <Link
            href="/blog"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.75rem', transition: 'color 0.2s' }}
          >
            <ArrowLeft size={14} /> Все статьи
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{
              display: 'inline-flex', padding: '0.3rem 0.875rem', borderRadius: '9999px',
              background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.85)',
              fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
            }}>
              {post.category}
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: 'white', marginBottom: '1.5rem', lineHeight: 1.25, letterSpacing: '-0.02em' }}>
            {post.title}
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem', maxWidth: '40rem' }}>
            {post.excerpt}
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Clock size={14} /> {post.readTime} минут чтения
            </span>
            <span>{new Date(post.publishedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: 'var(--bg)', padding: '3.5rem 0 5rem' }}>
        <div className="container mx-auto px-6" style={{ maxWidth: '72rem' }}>

          {/* Reading progress note */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.875rem 1.25rem',
            background: 'var(--bg-sage)',
            borderRadius: '0.875rem',
            marginBottom: '2.5rem',
            border: '1px solid var(--primary-light)',
            maxWidth: '52rem',
          }}>
            <LogoSvg size={28} />
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
              Материал подготовлен командой «Снова с собой» совместно с практикующими психологами.
            </p>
          </div>

          {/* Article body with ToC */}
          <ArticleReader content={post.content} />

          {/* Keywords */}
          <div style={{ marginTop: '3rem', paddingTop: '1.75rem', borderTop: '1px solid var(--border)', maxWidth: '52rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
              Темы статьи
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {post.keywords.map((k) => (
                <span key={k} style={{
                  padding: '0.3rem 0.75rem', borderRadius: '9999px',
                  background: 'var(--bg-sage)', color: 'var(--primary-dark)',
                  fontSize: '0.8rem', fontWeight: 500,
                  border: '1px solid var(--primary-light)',
                }}>
                  {k}
                </span>
              ))}
            </div>
          </div>

          {/* Support page link */}
          {post.supportUrl && (
            <div style={{ marginTop: '2.5rem', maxWidth: '52rem', background: 'var(--bg-sage)', border: '1.5px solid var(--primary)', borderRadius: '1rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--primary-dark)', fontSize: '0.925rem', marginBottom: '0.25rem' }}>Хотите разобраться с этим в программе?</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Психолог + небольшая группа + 4 недели поддержки. Начните с вводной встречи — можно просто слушать.</div>
              </div>
              <Link href={post.supportUrl} style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.875rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                Узнать подробнее →
              </Link>
            </div>
          )}

          {/* FAQ */}
          {post.faq && post.faq.length > 0 && (
            <div style={{ marginTop: '2.5rem', maxWidth: '52rem' }}>
              <h2 style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text)', marginBottom: '1rem' }}>Частые вопросы</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {post.faq.map((item, i) => (
                  <div key={i} style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: '1rem', padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.925rem', marginBottom: '0.5rem' }}>{item.q}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.65 }}>{item.a}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div style={{
            marginTop: '3rem',
            background: 'var(--bg-dark)',
            borderRadius: '1.5rem',
            padding: '2.5rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            maxWidth: '52rem',
          }}>
            <div style={{ position: 'absolute', top: '-3rem', right: '-3rem', width: '12rem', height: '12rem', borderRadius: '50%', background: 'rgba(78,123,94,0.15)' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <LogoSvg size={56} />
              </div>
              <h3 style={{ fontWeight: 800, color: 'white', fontSize: '1.4rem', marginBottom: '0.625rem', lineHeight: 1.3 }}>
                Начните с вводной встречи
              </h3>
              <p style={{ color: 'rgba(168,184,160,1)', marginBottom: '1.75rem', fontSize: '0.975rem', lineHeight: 1.7 }}>
                90 минут в небольшой группе с психологом. Можно просто слушать, не рассказывая о себе. Без обязательства покупать программу.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/checkout?product=intro" className="btn-ghost-dark">
                  Записаться — 1 490 ₽ →
                </Link>
                <Link href="/quiz" style={{ color: 'rgba(168,184,160,0.75)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center' }}>
                  Пройти тест →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other posts */}
      {others.length > 0 && (
        <section style={{ background: 'var(--bg-soft)', padding: '4rem 0 5rem' }}>
          <div className="container mx-auto px-6" style={{ maxWidth: '52rem' }}>
            <h2 style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--text)', marginBottom: '1.5rem' }}>Читать также</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 16rem), 1fr))', gap: '1.25rem' }}>
              {others.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                  <div className="card" style={{ padding: 0, overflow: 'hidden', height: '100%' }}>
                    <div style={{ height: '3px', background: getColor(p.category) }} />
                    <div style={{ padding: '1.25rem' }}>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '9999px',
                        background: getBg(p.category), color: getColor(p.category),
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                        display: 'inline-block', marginBottom: '0.75rem',
                      }}>
                        {p.category}
                      </span>
                      <h3 style={{ fontWeight: 700, color: 'var(--text)', marginBottom: '0.75rem', fontSize: '0.925rem', lineHeight: 1.45 }}>
                        {p.title}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: getColor(p.category), fontWeight: 600, fontSize: '0.825rem' }}>
                        Читать <ArrowRight size={13} />
                      </div>
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
