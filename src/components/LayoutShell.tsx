'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isApp = pathname.startsWith('/dashboard') || pathname.startsWith('/specialist') || pathname.startsWith('/curator')

  return (
    <>
      {!isApp && <Header />}
      <main className="flex-1" style={{ paddingTop: isApp ? undefined : '4rem' }}>{children}</main>
      {!isApp && <Footer />}
    </>
  )
}
