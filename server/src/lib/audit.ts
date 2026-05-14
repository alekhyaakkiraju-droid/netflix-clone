import db from './db';
import logger from './logger';

export type AuditEvent =
  | 'USER_REGISTERED'
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'TOKEN_REFRESHED'
  | 'PROFILE_CREATED'
  | 'PROFILE_UPDATED'
  | 'PROFILE_DELETED'
  | 'SUBSCRIPTION_CREATED'
  | 'SUBSCRIPTION_UPDATED'
  | 'SUBSCRIPTION_CANCELLED'
  | 'PAYMENT_PROCESSED'
  | 'PAYMENT_METHOD_SAVED'
  | 'WATCHLIST_ADDED'
  | 'WATCHLIST_REMOVED';

export async function audit(
  event: AuditEvent,
  userId: string | null,
  meta?: Record<string, unknown>,
): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        event,
        userId,
        meta: meta ? JSON.stringify(meta) : undefined,
      },
    });
  } catch (err) {
    // Audit failures must never crash the main request — log and continue
    logger.error({ err, event, userId }, 'Failed to write audit log');
  }
}

export async function getAuditLogs(userId: string, limit = 50) {
  return db.auditLog.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}
