import { Plan } from '@prisma/client';
import * as repo from './repository';

export const getSubscription = (userId: string) => repo.getSubscription(userId);
export const createSubscription = (userId: string, plan: Plan) => repo.createSubscription(userId, plan);
export const updateSubscription = (userId: string, plan: Plan) => repo.updateSubscription(userId, plan);
export const cancelSubscription = (userId: string) => repo.cancelSubscription(userId);
export const isSubscribed = (userId: string) => repo.isSubscribed(userId);
