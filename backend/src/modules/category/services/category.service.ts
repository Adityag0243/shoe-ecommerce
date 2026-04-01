import type { Request, Response } from 'express';

import { ApiResponse } from '../../../shared/responses/api-response.builder.js';
import { asyncHandler } from '../../../shared/utils/async-handler.util.js';
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
    async (_req: Request, res: Response) => {
        const categories = await Category.find();
        res.status(200).json(
            new ApiResponse(200, 'Categories fetched successfully', categories),
        );
    },
);
