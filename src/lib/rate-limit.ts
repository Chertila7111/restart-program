type RateEntry = { count: number; resetAt: number }
const _store = new Map<string, RateEntry>()

setInterval(() => {
  const now = Date.now()
  for (const [k, v] of _store) if (v.resetAt <= now) _store.delete(k)
}, 600_000).unref?.()

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfter: number } {
  const now = Date.now()
  const entry = _store.get(key)
  if (!entry || entry.resetAt <= now) {
    _store.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfter: 0 }
  }
  if (entry.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }
  entry.count++
  return { ok: true, retryAfter: 0 }
}

// On Vercel the platform overwrites x-forwarded-for with the real client IP — safe to trust.
// On self-hosted deployments without a trusted reverse proxy, clients can spoof this header.
// If self-hosting, set TRUST_PROXY=false and add IP extraction from the TCP socket instead.
export function getClientIp(req: Request): string {
  const h = (req as any).headers as Headers
  return (
    h.get('x-real-ip') ||
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  )
}
