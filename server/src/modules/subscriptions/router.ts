import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import * as subService from './service';
import { Plan } from '@prisma/client';

const router = Router();
router.use(authenticate);

const planSchema = z.object({
  plan: z.nativeEnum(Plan, { message: 'Invalid subscription plan' }),
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sub = await subService.getSubscription(req.user!.userId);
    res.json(sub ?? { subscribed: false });
  } catch (err) { next(err); }
});

router.post(
  '/',
  validate(planSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sub = await subService.createSubscription(req.user!.userId, req.body.plan);
      res.status(201).json(sub);
    } catch (err) { next(err); }
  },
);

router.put(
  '/',
  validate(planSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sub = await subService.updateSubscription(req.user!.userId, req.body.plan);
      res.json(sub);
    } catch (err) { next(err); }
  },
);

router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sub = await subService.cancelSubscription(req.user!.userId);
    res.json(sub);
  } catch (err) { next(err); }
});

export default router;
