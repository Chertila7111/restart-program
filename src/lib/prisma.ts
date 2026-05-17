/* eslint-disable @typescript-eslint/no-explicit-any */
declare const globalThis: any

function createClient(): any {
  // All requires inside try-catch so any import failure is caught at module level
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaClient } = require('@prisma/client')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaLibSql } = require('@prisma/adapter-libsql')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const libsqlPkg = require('@libsql/client')
  const rawUrl = process.env.DATABASE_URL ?? 'file:/tmp/restart.db'
  const url = (rawUrl.startsWith('file:') || rawUrl.startsWith('libsql://') || rawUrl.startsWith('http'))
    ? rawUrl
    : `file:${rawUrl}`
  const libsql = libsqlPkg.createClient({ url })
  const adapter = new PrismaLibSql(libsql)
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
