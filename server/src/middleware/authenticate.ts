import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../lib/jwt';
import { UnauthorizedError } from '../lib/errors';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; email: string };
    }
  }
}

/**
 * Verifies the Bearer token in Authorization header.
 * Attaches { userId, email } to req.user on success.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authorization header missing or malformed');
  }

  const token = authHeader.slice(7);
  const payload = verifyAccessToken(token);
  req.user = { userId: payload.sub, email: payload.email };
  next();
}
