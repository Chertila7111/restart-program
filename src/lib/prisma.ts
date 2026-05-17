/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client'

declare const globalThis: any

function createClient(): PrismaClient {
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

function getClient(): PrismaClient {
  if (globalThis.__prisma) return globalThis.__prisma
  try {
    globalThis.__prisma = createClient()
  } catch (err) {
    console.error('[prisma] init failed:', err)
    // Proxy that rejects on every query — page try-catch blocks handle it
    globalThis.__prisma = new Proxy({} as PrismaClient, {
      get: () => new Proxy({}, {
        get: () => () => Promise.reject(new Error('DB unavailable')),
      }),
    })
  }
  return globalThis.__prisma
}

export const prisma: PrismaClient = getClient()
