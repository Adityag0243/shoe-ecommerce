import type { Request, Response } from 'express';

import { ApiResponse } from '../../../shared/responses/api-response.builder.js';
import { asyncHandler } from '../../../shared/utils/async-handler.util.js';
import {
    getPaginationMeta,
    getPaginationParams,
} from '../../../shared/utils/pagination.util.js';
import { Category } from '../repositories/category.model.js';

export const createCategory = asyncHandler(
    async (req: Request, res: Response) => {
        const category = await Category.create(req.body);
        res.status(201).json(
            new ApiResponse(200, 'Category created', category),
        );
    },
);

export const getCategories = asyncHandler(
    async (req: Request, res: Response) => {
        const { page, limit, skip } = getPaginationParams(
            (req.query as Record<string, unknown>) ?? {},
            { limit: 20, maxLimit: 100 },
        );

        const [items, totalItems] = await Promise.all([
            Category.find().skip(skip).limit(limit),
            Category.countDocuments(),
        ]);

        return res.status(200).json(
            new ApiResponse(200, 'Categories fetched successfully', {
                items,
                pagination: getPaginationMeta(page, limit, totalItems),
            }),
        );
    },
);
