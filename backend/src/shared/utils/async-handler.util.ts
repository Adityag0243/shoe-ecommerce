import type { NextFunction, Request, Response } from 'express';

export const asyncHandler =
    (
        requestHandler: (
            req: Request,
            res: Response,
            next: NextFunction,
        ) => unknown,
    ) =>
    async (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((error: any) => {
            const statusCode = Number(error?.code);
            const validStatus =
                statusCode >= 100 && statusCode < 600 ? statusCode : 500;
            res.status(validStatus).json({
                success: false,
                message: error?.message || 'INTERNAL SERVER ERROR',
            });
        });
    };
