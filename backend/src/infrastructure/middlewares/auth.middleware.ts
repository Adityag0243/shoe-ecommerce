import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { config } from '../../config.js';
import { User } from '../../modules/user/repositories/user.model.js';
import { ApiError } from '../../shared/errors/api-error.class.js';
import { asyncHandler } from '../../shared/utils/async-handler.util.js';

export const authMiddleware = asyncHandler(
    async (req: Request, _res: Response, next: NextFunction) => {
        try {
            const token =
                (req as any).cookies?.accessToken ||
                req.header('Authorization')?.replace('Bearer ', '').trim();

            if (!token) throw new ApiError(401, 'Unauthorized, token missing');

            const decoded = jwt.verify(
                token,
                config.accessTokenSecret as any,
            ) as any;
            const user = await User.findById(decoded._id).select(
                '-password -refreshToken',
            );

            if (!user) throw new ApiError(401, 'Unauthorized, user not found');

            (req as any).user = user;
            next();
        } catch (error: any) {
            if (error?.name === 'JsonWebTokenError') {
                return next(
                    new ApiError(401, 'Unauthorized, invalid token', [
                        error?.message,
                    ]),
                );
            }
            next(error);
        }
    },
);

export const adminMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction,
) => {
    const user = (req as any).user;
    if (user && user.role === 'admin') return next();
    next(new ApiError(403, 'Access denied, admin only'));
};
