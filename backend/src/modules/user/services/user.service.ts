import type { Request, Response } from 'express';

import { ApiError } from '../../../shared/errors/api-error.class.js';
import { ApiResponse } from '../../../shared/responses/api-response.builder.js';
import { asyncHandler } from '../../../shared/utils/async-handler.util.js';
import { Favourite } from '../repositories/favourite.model.js';
import { Profile } from '../repositories/profile.model.js';
import { User } from '../repositories/user.model.js';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const profile = await Profile.findOne({ userId });
        const user = await User.findById((req as any).user?._id).select(
            '-password',
        );

        if (!user) throw new ApiError(404, 'User not found');

        res.status(200).json(
            new ApiResponse(200, 'User fetched successfully', {
                user,
                profile,
            }),
        );
    } catch {
        throw new ApiError(500, 'Failed to fetch user');
    }
});

export const updateProfile = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = (req as any).user?.id;
        const profile = await Profile.findOneAndUpdate({ userId }, req.body, {
            new: true,
            upsert: true,
        });

        res.status(200).json(
            new ApiResponse(200, 'Profile updated successfully', profile),
        );
    },
);

export const addFavourite = asyncHandler(
    async (req: Request, res: Response) => {
        const fav = await Favourite.create({
            userId: (req as any).user?.id,
            productId: req.body?.productId,
        });

        res.status(201).json(
            new ApiResponse(201, 'Added to favourites successfully', fav),
        );
    },
);

export const getFavourites = asyncHandler(
    async (req: Request, res: Response) => {
        const favs = await Favourite.find({
            userId: (req as any).user?.id,
        }).populate('productId');

        res.status(200).json(
            new ApiResponse(200, 'Favourites fetched successfully', favs),
        );
    },
);

export const removeFavourite = asyncHandler(
    async (req: Request, res: Response) => {
        await Favourite.findOneAndDelete({
            userId: (req as any).user?.id,
            productId: req.params.id,
        });

        res.status(200).json(
            new ApiResponse(200, 'Removed from favourites successfully', null),
        );
    },
);
