import { z } from 'zod';

export const saveCardSchema = z.object({
  // Frontend sends a Stripe payment method token — never raw card data
  paymentMethodToken: z.string().min(1, 'Payment method token is required'),
});

export const proceedPaymentSchema = z.object({
  plan: z.enum(['MOBILE', 'STANDARD', 'STANDARD_WITH_ADS', 'PREMIUM'] as const, {
    message: 'Invalid plan. Must be MOBILE, STANDARD, STANDARD_WITH_ADS, or PREMIUM',
  }),
  paymentMethodToken: z.string().min(1, 'Payment method token is required'),
});

export type SaveCardInput = z.infer<typeof saveCardSchema>;
export type ProceedPaymentInput = z.infer<typeof proceedPaymentSchema>;
