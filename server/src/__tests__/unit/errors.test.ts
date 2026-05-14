import { describe, it, expect } from '@jest/globals';
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationError,
  TooManyRequestsError,
} from '../../lib/errors';

describe('AppError hierarchy', () => {
  it('BadRequestError has status 400', () => {
    const err = new BadRequestError('bad input');
    expect(err.statusCode).toBe(400);
    expect(err.isOperational).toBe(true);
    expect(err.message).toBe('bad input');
  });

  it('UnauthorizedError has status 401', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
  });

  it('ForbiddenError has status 403', () => {
    expect(new ForbiddenError().statusCode).toBe(403);
  });

  it('NotFoundError has status 404', () => {
    expect(new NotFoundError('not found').statusCode).toBe(404);
  });

  it('ConflictError has status 409', () => {
    expect(new ConflictError('conflict').statusCode).toBe(409);
  });

  it('ValidationError has status 422 and details array', () => {
    const details = [{ field: 'email', message: 'Invalid email' }];
    const err = new ValidationError('validation failed', details);
    expect(err.statusCode).toBe(422);
    expect(err.details).toEqual(details);
  });

  it('TooManyRequestsError has status 429', () => {
    expect(new TooManyRequestsError().statusCode).toBe(429);
  });

  it('all errors are instances of AppError', () => {
    expect(new BadRequestError('x')).toBeInstanceOf(AppError);
    expect(new UnauthorizedError()).toBeInstanceOf(AppError);
  });
});
