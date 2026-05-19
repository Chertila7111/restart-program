'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, Users, Calendar, User,
  BookOpen, MessageCircle, Star, FileText,
  Clock, HelpCircle, LogOut, ArrowLeft,
} from 'lucide-react'
import { LogoSvg } from '@/components/LogoSvg'

type NavItem = { href: string; label: string; icon: React.ElementType }

const NAV: NavItem[] = [
  { href: '/specialist',               label: 'Главная',     icon: LayoutDashboard },
  { href: '/specialist/groups',        label: 'Группы',      icon: Users },
  { href: '/specialist/clients',       label: 'Участники',   icon: User },
  { href: '/specialist/calendar',      label: 'Календарь',   icon: Calendar },
  { href: '/specialist/availability',  label: 'Слоты',       icon: Clock },
  { href: '/specialist/sessions',      label: 'Встречи',     icon: BookOpen },
  { href: '/specialist/journals',      label: 'Дневники',    icon: FileText },
  { href: '/specialist/recommendations', label: 'Рекомендации', icon: Star },
  { href: '/specialist/chats',         label: 'Чаты',        icon: MessageCircle },
  { href: '/specialist/profile',       label: 'Мой профиль', icon: User },
  { href: '/specialist/help',          label: 'Помощь',      icon: HelpCircle },
]

type Props = {
  user: { name: string | null; email: string }
  children: React.ReactNode
}

function initials(name: string | null, email: string) {
  if (name) return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return email[0].toUpperCase()
}

export function SpecialistShell({ user, children }: Props) {
  const pathname = usePathname()
  const isActive = (href: string) =>
    href === '/specialist' ? pathname === '/specialist' : pathname.startsWith(href)

  const [photoUrl, setPhotoUrl] = useState('')
  useEffect(() => {
    fetch('/api/specialist/profile')
      .then(r => r.json())
      .then(d => {
        let url: string = d.profile?.photoUrl ?? ''
        if (url.startsWith('/uploads/')) url = '/api/uploads/' + url.slice('/uploads/'.length)
        setPhotoUrl(url)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="dashboard-layout">
      {/* ── Sidebar ── */}
      <aside className="dashboard-sidebar">
        <div style={{ padding: '1rem 1rem 0.75rem', borderBottom: '1px solid var(--border)' }}>
          <Link href="/" style={{ display: 'block', textDecoration: 'none', marginBottom: '0.625rem' }}>
            <LogoSvg size={64} />
          </Link>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--text-light)', textDecoration: 'none', padding: '0.2rem 0.5rem', borderRadius: '0.4rem', background: 'var(--bg-soft)' }}>
            <ArrowLeft size={10} /> На сайт
          </Link>
        </div>

        <Link href="/specialist/profile" style={{ display: 'block', padding: '1rem', borderBottom: '1px solid var(--border)', textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: '#3D6249', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem', fontWeight: 700, color: 'white', overflow: 'hidden' }}>
              {photoUrl
                ? <img src={photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initials(user.name, user.email)
              }
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name || user.email.split('@')[0]}
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#2D5A3D', background: '#D1FAE5', padding: '0.1rem 0.5rem', borderRadius: '9999px', display: 'inline-block', marginTop: '0.15rem' }}>
                Психолог
              </div>
            </div>
          </div>
        </Link>

        <nav style={{ padding: '0.625rem', flex: 1, overflowY: 'auto' }}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.625rem', borderRadius: '0.625rem', marginBottom: '0.125rem', textDecoration: 'none', background: active ? 'var(--primary-light)' : 'transparent', color: active ? 'var(--primary-dark)' : 'var(--text-muted)', fontWeight: active ? 600 : 400, fontSize: '0.825rem', transition: 'background 0.15s, color 0.15s' }}>
                <Icon size={15} style={{ flexShrink: 0 }} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <button onClick={() => signOut({ callbackUrl: '/' })} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem 0.625rem', borderRadius: '0.625rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', fontSize: '0.8rem', textAlign: 'left' }}>
            <LogOut size={14} /> Выйти
          </button>
        </div>
      </aside>

      {/* ── Mobile nav ── */}
      <div className="dashboard-mobile-nav">
        {NAV.slice(0, 5).map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link key={href} href={href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', padding: '0.5rem 0.75rem', textDecoration: 'none', color: active ? 'var(--primary)' : 'var(--text-light)', fontSize: '0.6rem', fontWeight: active ? 700 : 400 }}>
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </div>

      <main className="dashboard-content">
        {children}
      </main>
    </div>
  )
}
