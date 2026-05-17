'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard, BookOpen, PenLine, CheckSquare,
  Calendar, MessageCircle, Video, User, CreditCard,
  HelpCircle, Lock, LogOut, Users, Settings, Shield,
} from 'lucide-react'
import { LighthouseIcon } from '@/components/LighthouseIcon'

export type Tier = 'none' | 'intro' | 'base' | 'plus' | 'personal'

type NavItem = {
  href: string
  label: string
  icon: React.ElementType
  access: Tier[]
}

const USER_NAV: NavItem[] = [
  { href: '/dashboard',              label: 'Главная',   icon: LayoutDashboard, access: ['none','intro','base','plus','personal'] },
  { href: '/dashboard/program',      label: 'Программа', icon: BookOpen,         access: ['base','plus','personal'] },
  { href: '/dashboard/journal',      label: 'Дневник',   icon: PenLine,          access: ['base','plus','personal'] },
  { href: '/dashboard/tasks',        label: 'Задания',   icon: CheckSquare,      access: ['base','plus','personal'] },
  { href: '/dashboard/calendar',     label: 'Календарь', icon: Calendar,         access: ['base','plus','personal'] },
  { href: '/dashboard/chats',        label: 'Чаты',      icon: MessageCircle,    access: ['base','plus','personal'] },
  { href: '/dashboard/recordings',   label: 'Записи',    icon: Video,            access: ['base','plus','personal'] },
  { href: '/dashboard/psychologist', label: 'Психолог',  icon: User,             access: ['intro','base','plus','personal'] },
  { href: '/dashboard/plan',         label: 'Тариф',     icon: CreditCard,       access: ['none','intro','base','plus','personal'] },
  { href: '/dashboard/help',         label: 'Помощь',    icon: HelpCircle,       access: ['none','intro','base','plus','personal'] },
]

type SimpleNavItem = { href: string; label: string; icon: React.ElementType }

const PSYCHOLOGIST_NAV: SimpleNavItem[] = [
  { href: '/dashboard',               label: 'Главная',    icon: LayoutDashboard },
  { href: '/dashboard/patients',      label: 'Участники',  icon: Users },
  { href: '/dashboard/chats',         label: 'Чаты',       icon: MessageCircle },
  { href: '/dashboard/psych-profile', label: 'Мой профиль',icon: Settings },
  { href: '/dashboard/help',          label: 'Помощь',     icon: HelpCircle },
]

const ADMIN_EXTRA: SimpleNavItem[] = [
  { href: '/dashboard/admin', label: 'Панель адм.', icon: Shield },
]

const TIER_LABEL: Record<Tier, string> = {
  none: 'Нет тарифа',
  intro: 'Вводная встреча',
  base: 'Базовый',
  plus: 'Плюс',
  personal: 'Персональный',
}

type Props = {
  user: { name: string | null; email: string }
  tier: Tier
  role?: string
  children: React.ReactNode
}

function initials(name: string | null, email: string) {
  if (name) return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return email[0].toUpperCase()
}

export function DashboardShell({ user, tier, role = 'user', children }: Props) {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  const isPsychologist = role === 'psychologist'
  const isAdmin = role === 'admin'

  const allNavItems: SimpleNavItem[] = isPsychologist
    ? PSYCHOLOGIST_NAV
    : [
        ...USER_NAV,
        ...(isAdmin ? ADMIN_EXTRA : []),
      ]

  const hasAccess = (item: SimpleNavItem) => {
    if (isPsychologist || isAdmin) return true
    const ui = item as NavItem
    return Array.isArray(ui.access) ? ui.access.includes(tier) : true
  }

  const roleLabel = isAdmin ? 'Администратор' : isPsychologist ? 'Психолог' : TIER_LABEL[tier]
  const avatarBg = isAdmin ? '#1C2B23' : isPsychologist ? '#3D6249' : 'var(--primary)'

  return (
    <div className="dashboard-layout">
      {/* ── Desktop sidebar ── */}
      <aside className="dashboard-sidebar">
        {/* Brand */}
        <div style={{ padding: '1.25rem 1rem 1rem', borderBottom: '1px solid var(--border)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: '1.875rem', height: '1.875rem', borderRadius: '0.5rem', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <LighthouseIcon size={16} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)', letterSpacing: '-0.02em' }}>Restart</span>
          </Link>
        </div>

        {/* User */}
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>
              {initials(user.name, user.email)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name || user.email.split('@')[0]}
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--primary-dark)', background: 'var(--primary-light)', padding: '0.1rem 0.5rem', borderRadius: '9999px', display: 'inline-block', marginTop: '0.15rem' }}>
                {roleLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ padding: '0.625rem', flex: 1, overflowY: 'auto' }}>
          {allNavItems.map((item) => {
            const active = isActive(item.href)
            const accessible = hasAccess(item)
            const Icon = item.icon
            if (!accessible) {
              return (
                <Link key={item.href} href="/dashboard/plan" title="Доступно в платном тарифе" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.625rem', borderRadius: '0.625rem', marginBottom: '0.125rem', textDecoration: 'none', color: 'var(--text-light)', fontSize: '0.825rem', opacity: 0.6 }}>
                  <Icon size={15} style={{ flexShrink: 0 }} />
                  {item.label}
                  <Lock size={10} style={{ marginLeft: 'auto', flexShrink: 0 }} />
                </Link>
              )
            }
            return (
              <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.625rem', borderRadius: '0.625rem', marginBottom: '0.125rem', textDecoration: 'none', background: active ? 'var(--primary-light)' : 'transparent', color: active ? 'var(--primary-dark)' : 'var(--text-muted)', fontWeight: active ? 600 : 400, fontSize: '0.825rem', transition: 'background 0.15s, color 0.15s' }}>
                <Icon size={15} style={{ flexShrink: 0 }} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Sign out */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <button onClick={() => signOut({ callbackUrl: '/' })} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.5rem 0.625rem', borderRadius: '0.625rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', fontSize: '0.8rem', textAlign: 'left' }}>
            <LogOut size={14} /> Выйти
          </button>
        </div>
      </aside>

      {/* ── Mobile bottom nav ── */}
      <div className="dashboard-mobile-nav">
        {allNavItems.filter(item => hasAccess(item)).slice(0, 5).map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem', padding: '0.5rem 0.75rem', textDecoration: 'none', color: active ? 'var(--primary)' : 'var(--text-light)', fontSize: '0.6rem', fontWeight: active ? 700 : 400 }}>
              <Icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* ── Content ── */}
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  )
}
