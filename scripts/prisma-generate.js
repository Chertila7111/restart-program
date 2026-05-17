#!/usr/bin/env node
// Cross-platform: ensure DATABASE_URL is set before prisma generate
const { execSync } = require('child_process')
const env = { ...process.env }
if (!env.DATABASE_URL) {
  env.DATABASE_URL = 'file:/tmp/dev.db'
}
try {
  execSync('npx prisma generate', { stdio: 'inherit', env })
} catch (e) {
  process.exit(e.status || 1)
}
