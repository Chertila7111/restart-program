'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import { useSession } from 'next-auth/react'

const nav = [
  { href: '/program', label: 'Программа' },
  { href: '/pricing', label: 'Тарифы' },
  { href: '/reviews', label: 'Отзывы' },
  { href: '/blog', label: 'Блог' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contacts', label: 'Контакты' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const isLoggedIn = !!session?.user

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      background: 'rgba(250,247,243,0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(221,214,204,0.6)',
    }}>
      <div className="container mx-auto px-6" style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: '4rem',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Image src="/logo.png" alt="Снова с собой" width={110} height={110} style={{ objectFit: 'contain', display: 'block', height: '52px', width: 'auto' }} />
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden md:block"
              style={{
                fontSize: '0.875rem', fontWeight: 500,
                color: 'var(--text-muted)', textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                fontSize: '0.875rem', fontWeight: 600,
                color: 'var(--primary-dark)', textDecoration: 'none',
                background: 'var(--primary-light)',
                padding: '0.45rem 1rem', borderRadius: '0.625rem',
                transition: 'opacity 0.2s',
              }}
            >
              <LayoutDashboard size={14} />
              Мой кабинет
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                style={{
                  fontSize: '0.875rem', fontWeight: 500,
                  color: 'var(--text-muted)', textDecoration: 'none',
                }}
              >
                Войти
              </Link>
              <Link href="/quiz" className="btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
                Пройти тест
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Меню"
          className="md:hidden"
          style={{
            padding: '0.5rem', background: 'none', border: 'none',
            cursor: 'pointer', color: 'var(--text)',
          }}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          background: 'var(--bg)',
          borderTop: '1px solid var(--border)',
          padding: '1rem 1.5rem 1.5rem',
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column' }}>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  padding: '0.875rem 0',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '0.975rem', fontWeight: 500,
                  color: 'var(--text)', textDecoration: 'none',
                }}
              >
                {item.label}
              </Link>
            ))}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1.25rem' }}>
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="btn-primary"
                  style={{ textAlign: 'center', fontSize: '0.9rem' }}
                  onClick={() => setOpen(false)}
                >
                  Мой кабинет →
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', textDecoration: 'none' }}
                    onClick={() => setOpen(false)}
                  >
                    Войти
                  </Link>
                  <Link href="/quiz" className="btn-primary" style={{ textAlign: 'center', fontSize: '0.9rem' }} onClick={() => setOpen(false)}>
                    Пройти тест
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
