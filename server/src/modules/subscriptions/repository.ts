import db from '../../lib/db';
import { Plan, SubscriptionStatus } from '@prisma/client';
import { NotFoundError, ConflictError } from '../../lib/errors';

export async function getSubscription(userId: string) {
  return db.subscription.findUnique({ where: { userId } });
}

export async function createSubscription(userId: string, plan: Plan) {
  const existing = await db.subscription.findUnique({ where: { userId } });
  if (existing) {
    throw new ConflictError('User already has a subscription. Use update to change plan.');
  }
  return db.subscription.create({
    data: { userId, plan, status: SubscriptionStatus.ACTIVE },
  });
}

export async function updateSubscription(userId: string, plan: Plan) {
  const existing = await db.subscription.findUnique({ where: { userId } });
  if (!existing) throw new NotFoundError('No subscription found for this user');
  return db.subscription.update({
    where: { userId },
    data: { plan, status: SubscriptionStatus.ACTIVE },
  });
}

export async function cancelSubscription(userId: string) {
  const existing = await db.subscription.findUnique({ where: { userId } });
  if (!existing) throw new NotFoundError('No subscription found for this user');
  return db.subscription.update({
    where: { userId },
    data: { status: SubscriptionStatus.CANCELLED },
  });
}

export async function isSubscribed(userId: string): Promise<boolean> {
  const sub = await db.subscription.findUnique({ where: { userId } });
  return sub?.status === SubscriptionStatus.ACTIVE;
}
