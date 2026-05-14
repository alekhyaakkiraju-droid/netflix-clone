import { NextFunction, Request, Response } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../lib/errors';

type Target = 'body' | 'query' | 'params';

/**
 * Express middleware factory that validates a request target (body/query/params)
 * against a Zod schema.
 *
 * On failure it throws a ValidationError (422) with structured field-level details
 * so the global error handler can return them to the client.
 */
export function validate(schema: ZodSchema, target: Target = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const details = formatZodError(result.error);
      throw new ValidationError('Validation failed', details);
    }

    // Replace raw input with the parsed (and coerced) value
    req[target] = result.data as typeof req[typeof target];
    next();
  };
}

function formatZodError(error: ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));
}
