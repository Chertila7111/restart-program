'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'
import { BLOG_POSTS } from '@/lib/blog'

export default function RecommendedArticles() {
  const [posts, setPosts] = useState<typeof BLOG_POSTS>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('quizResult')
      if (!raw) return
      const { slugs } = JSON.parse(raw)
      if (!Array.isArray(slugs)) return
      const found = slugs
        .map((s: string) => BLOG_POSTS.find(p => p.slug === s))
        .filter(Boolean) as typeof BLOG_POSTS
      setPosts(found)
    } catch { /* ignore */ }
  }, [])

  if (posts.length === 0) return null

  return (
    <div className="card" style={{ padding: '1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <BookOpen size={14} style={{ color: 'var(--primary)' }} />
        </div>
        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>Подборка для вас</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {posts.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--bg-soft)',
              border: '1.5px solid var(--border)',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              transition: 'border-color 0.15s',
            }}>
              <span style={{ fontSize: '0.825rem', color: 'var(--text)', fontWeight: 500, lineHeight: 1.4 }}>
                {post.title}
              </span>
              <ArrowRight size={13} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
