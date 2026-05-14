import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { saveCardSchema, proceedPaymentSchema } from './schemas';
import * as paymentService from './service';

const router = Router();
router.use(authenticate);

/**
 * POST /api/v1/payments/card
 * Accepts a Stripe paymentMethodToken — never raw card numbers.
 * Compliant with PCI-DSS SAQ A (no card data on server).
 */
router.post(
  '/card',
  validate(saveCardSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await paymentService.savePaymentMethod(
        req.user!.userId,
        req.body.paymentMethodToken,
        req.body.last4,
      );
      res.status(201).json(result);
    } catch (err) { next(err); }
  },
);

/** POST /api/v1/payments/proceed — charge and create subscription */
router.post(
  '/proceed',
  validate(proceedPaymentSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payment = await paymentService.processPayment(
        req.user!.userId,
        req.body.plan,
        req.body.paymentMethodToken,
      );
      res.status(201).json(payment);
    } catch (err) { next(err); }
  },
);

router.get('/history', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const history = await paymentService.getPaymentHistory(req.user!.userId);
    res.json(history);
  } catch (err) { next(err); }
});

export default router;
