import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

export function validateRequest(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.flatten();
      const error = new Error('Lütfen bilgilerinizi kontrol edin.') as Error & {
        statusCode: number;
        code: number;
        type: string;
        retryable: boolean;
        details: typeof details;
      };
      error.statusCode = 400;
      error.code = 1001;
      error.type = 'VALIDATION_ERROR';
      error.retryable = false;
      error.details = details;
      next(error);
      return;
    }

    req.body = result.data;
    next();
  };
}
