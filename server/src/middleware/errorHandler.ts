import { NextFunction, Request, Response } from 'express';
import { AppError, ValidationError } from '../lib/errors';
import logger from '../lib/logger';

/**
 * Global error handler — must be registered AFTER all routes.
 *
 * Operational AppErrors are sent to the client with their status and message.
 * Unknown/programming errors are logged in full but only a generic 500 is
 * returned to avoid leaking internals.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error({ err, req: { method: req.method, url: req.url } }, 'Unhandled application error');
    }

    const body: Record<string, unknown> = {
      error: err.name,
      message: err.message,
      statusCode: err.statusCode,
    };

    if (err instanceof ValidationError && err.details !== undefined) {
      body['details'] = err.details;
    }

    res.status(err.statusCode).json(body);
    return;
  }

  // Unknown error — log the full error, return generic 500
  logger.error({ err, req: { method: req.method, url: req.url } }, 'Unexpected error');
  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
    statusCode: 500,
  });
}

/**
 * 404 catch-all — must be registered BEFORE errorHandler, AFTER all routes.
 */
export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: 'NotFound',
    message: `Cannot ${req.method} ${req.url}`,
    statusCode: 404,
  });
}
