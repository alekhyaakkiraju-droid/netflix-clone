import rateLimit from 'express-rate-limit';
import { TooManyRequestsError } from '../lib/errors';

/**
 * Strict rate limiter for authentication endpoints.
 * 10 requests per 15-minute window per IP.
 * Designed to slow down brute-force attacks on /login and /register.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new TooManyRequestsError('Too many authentication attempts. Please try again in 15 minutes.'));
  },
  skipSuccessfulRequests: false,
});

/**
 * General API rate limiter — 300 requests per 15-minute window per IP.
 * Applied globally to prevent API abuse.
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, _res, next) => {
    next(new TooManyRequestsError('Too many requests. Please slow down.'));
  },
});
