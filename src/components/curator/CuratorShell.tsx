'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, Users, Users2, MessageCircle, LogOut, ArrowLeft, Bell } from 'lucide-react'
import { LogoSvg } from '@/components/LogoSvg'

type NavItem = { href: string; label: string; icon: React.ElementType }

const NAV: NavItem[] = [
  { href: '/curator',         label: 'Главная',        icon: LayoutDashboard },
  { href: '/curator/clients', label: 'Участники',       icon: Users },
  { href: '/curator/groups',  label: 'Группы',          icon: Users2 },
  { href: '/curator/chats',   label: 'Чаты',            icon: MessageCircle },
]

type Props = { user: { name: string | null; email: string }; children: React.ReactNode }

function initials(name: string | null, email: string) {
  if (name) return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  return email[0].toUpperCase()
}

function NotificationBell() {
  const [count, setCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<any[]>([])

  const load = async () => {
    try {
      const res = await fetch('/api/curator/notifications')
      const data = await res.json()
      setCount(data.count ?? 0)
      setItems(data.items ?? [])
    } catch {}
  }

  useEffect(() => {
    load()
    const id = setInterval(load, 60000)
    return () => clearInterval(id)
  }, [])

  const markRead = async () => {
    if (count === 0) return
    await fetch('/api/curator/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'markRead' }),
    }).catch(() => {})
    setCount(0)
    setItems(prev => prev.map(n => ({ ...n, read: 1 })))
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => { setOpen(!open); if (!open) markRead() }}
        style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem', borderRadius: '0.5rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
      >
        <Bell size={16} />
        {count > 0 && (
          <span style={{ position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderRadius: '50%', background: '#EF4444', color: 'white', fontSize: '0.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid white' }}>
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: 'fixed', top: '3.5rem', right: '1rem', width: 'min(320px, 92vw)', maxHeight: '60vh', overflowY: 'auto', background: 'white', borderRadius: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.14)', border: '1px solid var(--border)', zIndex: 300 }}>
          <div style={{ padding: '0.875rem 1rem 0.625rem', borderBottom: '1px solid var(--border)', fontWeight: 700, fontSize: '0.875rem', color: 'var(--text)' }}>Уведомления</div>
          {items.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.825rem' }}>Нет уведомлений</div>
          ) : (
            items.slice(0, 15).map((n: any) => (
              <div key={n.id} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', background: n.read ? 'white' : 'var(--bg-sage)' }}>
                <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--text)', marginBottom: '0.15rem' }}>{n.title}</div>
                {n.body && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.body}</div>}
                <div style={{ fontSize: '0.68rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                  {new Date(n.createdAt).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export function CuratorShell({ user, children }: Props) {
  const pathname = usePathname()
  const isActive = (href: string) =>
    href === '/curator' ? pathname === '/curator' : pathname.startsWith(href)

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div style={{ padding: '1rem 1rem 0.75rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <Link href="/" style={{ display: 'block', textDecoration: 'none', marginBottom: '0.625rem' }}>
              <LogoSvg size={64} />
            </Link>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--text-light)', textDecoration: 'none', padding: '0.2rem 0.5rem', borderRadius: '0.4rem', background: 'var(--bg-soft)' }}>
              <ArrowLeft size={10} /> На сайт
            </Link>
          </div>
          <NotificationBell />
        </div>

        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: '#C28A5E', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>
              {initials(user.name, user.email)}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.825rem', color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name || user.email.split('@')[0]}
              </div>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#92400E', background: '#FEF3C7', padding: '0.1rem 0.5rem', borderRadius: '9999px', display: 'inline-block', marginTop: '0.15rem' }}>
                Куратор
              </div>
            </div>
          </div>
        </div>

        <nav style={{ padding: '0.625rem', flex: 1, overflowY: 'auto' }}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = isActive(href)
            return (
              <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.625rem', borderRadius: '0.625rem', marginBottom: '0.125rem', textDecoration: 'none', background: active ? '#FEF3C7' : 'transparent', color: active ? '#92400E' : 'var(--text-muted)', fontWeight: active ? 600 : 400, fontSize: '0.825rem', transition: 'background 0.15s, color 0.15s' }}>
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

      <div className="dashboard-mobile-nav">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link key={href} href={href} style={{ color: active ? '#C28A5E' : 'var(--text-light)', fontSize: '0.62rem', fontWeight: active ? 700 : 400 }}>
              <Icon size={20} />
              {label}
            </Link>
          )
        })}
      </div>

      <main className="dashboard-content">{children}</main>
    </div>
  )
}
