/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client'

declare const globalThis: any

function createClient() {
  // Prisma v7 + libsql adapter for SQLite
  // Using require() to bypass TS strict type checks on the adapter
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaLibSql } = require('@prisma/adapter-libsql')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const libsqlPkg = require('@libsql/client')
  const rawUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db'
  // Keep libsql:// and file: as-is; only prefix bare paths
  const url = (rawUrl.startsWith('file:') || rawUrl.startsWith('libsql://') || rawUrl.startsWith('http')) ? rawUrl : `file:${rawUrl}`
  const libsql = libsqlPkg.createClient({ url })
  const adapter = new PrismaLibSql(libsql)
  return new PrismaClient({ adapter })
}

const prisma: PrismaClient =
  globalThis.__prisma ?? (globalThis.__prisma = createClient())

export { prisma }
