import type { Request, Response } from 'express';

import { ApiResponse } from '../../../shared/responses/api-response.builder.js';
import { asyncHandler } from '../../../shared/utils/async-handler.util.js';
import { Review } from '../repositories/review.model.js';

export const getMyReviews = asyncHandler(
    async (req: Request, res: Response) => {
        const reviews = await Review.find({
            userId: (req as any).user?.id,
        }).populate('productId');
        res.status(200).json(
            new ApiResponse(200, 'Reviews fetched successfully', reviews),
        );
    },
);
