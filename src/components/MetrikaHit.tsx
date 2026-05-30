'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, Suspense } from 'react'

const YM_ID = 109291907

function HitTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isFirst = useRef(true)
  const prevUrl = useRef('')

  useEffect(() => {
    const qs = searchParams.toString()
    const url = pathname + (qs ? '?' + qs : '')

    // Skip first render — initial hit is sent by ym('init')
    if (isFirst.current) {
      isFirst.current = false
      prevUrl.current = url
      return
    }

    if (prevUrl.current === url) return
    prevUrl.current = url

    if (typeof window !== 'undefined' && typeof (window as any).ym === 'function') {
      ;(window as any).ym(YM_ID, 'hit', window.location.href, {
        referer: document.referrer,
        title: document.title,
      })
    }
  }, [pathname, searchParams])

  return null
}

// Suspense required because useSearchParams() suspends in Next.js App Router
export default function MetrikaHit() {
  return (
    <Suspense fallback={null}>
      <HitTracker />
    </Suspense>
  )
}
