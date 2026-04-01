import type { NextFunction, Request, Response } from 'express';

import { ApiError } from '../../shared/errors/api-error.class.js';

export const notFoundMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    res.header(
        'Access-Control-Allow-Origin',
        'https://shoe-ecommerce-mu.vercel.app',
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};
