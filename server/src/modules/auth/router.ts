import { Router, Request, Response, NextFunction } from 'express';
import { validate } from '../../middleware/validate';
import { registerSchema, loginSchema, refreshSchema } from './schemas';
import * as authService from './service';

const router = Router();

router.post(
  '/register',
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  '/login',
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  '/refresh',
  validate(refreshSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.refresh(req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

router.get(
  '/verify-email/:email',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const exists = await authService.verifyEmailExists(req.params.email);
      res.json({ exists });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
