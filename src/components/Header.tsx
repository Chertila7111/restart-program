'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #EC4899 100%)' }}
          >
            R
          </div>
          <span className="font-bold text-lg" style={{ color: '#1F1535' }}>
            Restart
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-gray-600 hover:text-violet-600 transition-colors"
          >
            Войти
          </Link>
          <Link
            href="/pricing"
            className="btn-primary text-sm py-2 px-5"
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
          >
            Начать
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="Меню"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4">
          <nav className="flex flex-col gap-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-violet-600"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3">
              <Link href="/auth/login" className="text-sm text-center text-gray-600" onClick={() => setOpen(false)}>
                Войти
              </Link>
              <Link href="/pricing" className="btn-primary text-center text-sm" onClick={() => setOpen(false)}>
                Начать программу
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
