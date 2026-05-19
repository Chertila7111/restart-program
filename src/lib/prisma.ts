/* eslint-disable @typescript-eslint/no-explicit-any */
declare const globalThis: any

function resolveDbUrl(): string {
  let raw = process.env.DATABASE_URL ?? ''
  // Turbopack can inline an unresolved env var as the string 'undefined'
  if (!raw || raw === 'undefined') {
    raw = process.env.NODE_ENV === 'production'
      ? 'file:/var/www/restart-app/data/restart.db'
      : 'file:./data/restart.db'
  }
  // Normalise: ensure it starts with a recognised scheme
  if (!raw.startsWith('file:') && !raw.startsWith('libsql://') && !raw.startsWith('http')) {
    raw = `file:${raw}`
  }
  return raw
}

function createClient(): any {
  // All requires inside try-catch so any import failure is caught at module level
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@prisma/client')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaLibSql } = require('@prisma/adapter-libsql')

  const url = resolveDbUrl()
  // PrismaLibSql v7.x is a factory — pass { url } directly, not a pre-created client
  const adapter = new PrismaLibSql({ url })
  return new PrismaClient({ adapter })
}

function getClient(): any {
  if (globalThis.__prisma) return globalThis.__prisma
  try {
    globalThis.__prisma = createClient()
  } catch (err) {
    console.error('[prisma] init failed:', err)
    // Proxy that rejects on every query — caught by page-level try-catch blocks
    globalThis.__prisma = new Proxy({}, {
      get: () => new Proxy({}, {
        get: () => () => Promise.reject(new Error('DB unavailable')),
      }),
    })
  }
  return globalThis.__prisma
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
export const prisma: any = getClient()
