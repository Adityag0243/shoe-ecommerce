import type { NextFunction, Request, Response } from 'express';

import { ApiResponse } from '../../shared/responses/api-response.builder.js';

export const errorMiddleware = (
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
     
    console.error('❌ Error:', err);
     
    console.error('❌ Error Stack:', err?.stack);

    const statusCode = err?.statusCode || 500;

    const origin = req.headers.origin;
    if (origin) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, OPTIONS',
    );
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    res.status(statusCode).json(
        new ApiResponse(
            statusCode,
            err?.message || 'Internal Server Error',
            process.env.NODE_ENV === 'production'
                ? { stack: null }
                : { stack: err?.stack },
        ),
    );
};
