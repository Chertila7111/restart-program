'use client'

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="btn-secondary"
      style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem' }}
    >
      Выйти
    </button>
  )
}
