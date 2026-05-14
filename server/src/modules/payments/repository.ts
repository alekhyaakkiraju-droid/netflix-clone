import db from '../../lib/db';
import { PaymentStatus, Plan } from '@prisma/client';

/**
 * Saves only tokenized payment method data — never raw card numbers (PCI-DSS).
 * In production, call Stripe.js on the frontend to tokenize, then pass the
 * paymentMethodId here.
 */
export async function savePaymentMethod(
  userId: string,
  providerToken: string,
  last4?: string,
) {
  // Store as a zero-amount PENDING payment record representing the saved method
  return db.payment.create({
    data: {
      userId,
      providerToken,
      last4: last4 ?? null,
      amountCents: 0,
      status: PaymentStatus.PENDING,
    },
    select: { id: true, last4: true, createdAt: true },
  });
}

export async function getPaymentHistory(userId: string) {
  return db.payment.findMany({
    where: { userId },
    select: {
      id: true,
      last4: true,
      amountCents: true,
      currency: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function processPayment(
  userId: string,
  plan: Plan,
  providerToken: string,
) {
  const planPrices: Record<Plan, number> = {
    MOBILE: 699,
    STANDARD: 1549,
    STANDARD_WITH_ADS: 699,
    PREMIUM: 2299,
  };

  // In production: call payment provider API here with the providerToken
  // For now: record a succeeded payment (stub)
  const payment = await db.payment.create({
    data: {
      userId,
      providerToken,
      amountCents: planPrices[plan],
      currency: 'USD',
      status: PaymentStatus.SUCCEEDED,
    },
    select: { id: true, amountCents: true, currency: true, status: true, createdAt: true },
  });

  return payment;
}
