import { prisma } from './prisma'

function aid() {
  return 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

export async function logAudit(opts: {
  actorId: string
  actorRole: string
  action: string
  targetUserId?: string
  entityType?: string
  entityId?: string
  metadata?: Record<string, unknown>
}): Promise<void> {
  try {
    await (prisma as any).$executeRawUnsafe(
      `INSERT INTO "AuditLog" (id, actorId, actorRole, action, targetUserId, entityType, entityId, metadata, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
      aid(),
      opts.actorId,
      opts.actorRole,
      opts.action,
      opts.targetUserId ?? null,
      opts.entityType ?? null,
      opts.entityId ?? null,
      opts.metadata ? JSON.stringify(opts.metadata) : null,
    )
  } catch {
    // Non-fatal — audit failure must never break business logic
  }
}
