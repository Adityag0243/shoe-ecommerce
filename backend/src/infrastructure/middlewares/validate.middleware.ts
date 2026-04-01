import type { NextFunction, Request, Response } from 'express';
import { ZodError, type ZodTypeAny } from 'zod';

import { ApiError } from '../../shared/errors/api-error.class.js';

export const validate =
    (schema: ZodTypeAny) =>
    (req: Request, _res: Response, next: NextFunction) => {
        try {
            const parsed = schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            }) as { body: unknown; query: unknown; params: unknown };

            (req as any).body = parsed.body;
            (req as any).query = parsed.query;
            (req as any).params = parsed.params;

            next();
        } catch (err) {
            if (err instanceof ZodError) {
                return next(new ApiError(400, 'Validation error', err.issues));
            }
            next(err);
        }
    };
