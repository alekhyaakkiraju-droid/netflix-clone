import { Plan } from '@prisma/client';
import * as repo from './repository';

export const savePaymentMethod = (userId: string, token: string, last4?: string) =>
  repo.savePaymentMethod(userId, token, last4);

export const getPaymentHistory = (userId: string) => repo.getPaymentHistory(userId);

export const processPayment = (userId: string, plan: Plan, token: string) =>
  repo.processPayment(userId, plan, token);
