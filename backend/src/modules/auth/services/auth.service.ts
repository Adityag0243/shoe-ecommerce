import type { Request, Response } from 'express';

import { ApiError } from '../../../shared/errors/api-error.class.js';
import { ApiResponse } from '../../../shared/responses/api-response.builder.js';
import { asyncHandler } from '../../../shared/utils/async-handler.util.js';
import { User } from '../../user/repositories/user.model.js';

const generateAccessAndRefreshTokens = async (userId: any) => {
    try {
        const user = await User.findById(userId);
        const accessToken = (user as any).generateAccessToken();
        const refreshToken = (user as any).generateRefreshToken();

        (user as any).refreshToken = refreshToken;
        await (user as any).save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch {
        throw new ApiError(
            500,
            'Something went wrong while generating refresh and access token',
        );
    }
};

export const register = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body ?? {};

    if ([fullName, email, password].some((field) => field?.trim?.() === '')) {
        throw new ApiError(400, 'All fields are compulsory');
    }

    const userExists = await User.findOne({ email });
    if (userExists) throw new ApiError(400, 'User already exists');

    const user = await User.create({ fullName, email, password });
    const createdUser = await User.findById((user as any)._id).select(
        '-password -refreshToken',
    );

    if (!createdUser) {
        throw new ApiError(
            500,
            'Something went wrong while registering a user',
        );
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, 'User Registered Successfully', createdUser),
        );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};

    if (!email) throw new ApiError(400, 'Email is required');

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, 'User does not exist');

    const isPasswordVaild = await (user as any).isPasswordCorrect(password);
    if (!isPasswordVaild) throw new ApiError(401, 'Invalid User credentails');

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
        (user as any)._id,
    );

    const loggedInUser = await User.findById((user as any)._id).select(
        '-password -refreshToken',
    );

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none' as const,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    return res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(
            new ApiResponse(200, 'User logged In Successfully', {
                user: loggedInUser,
                accessToken,
                refreshToken,
            }),
        );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
    const user = (req as any).user;
    await User.findByIdAndUpdate(
        user?._id,
        { $unset: { refreshToken: 1 } },
        { new: true },
    );

    const options = {
        httpOnly: true,
        secure: true,
        sameSite: 'none' as const,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, 'User logged Out', {}));
});

export const checkAuth = asyncHandler(async (req: Request, res: Response) => {
    if (!(req as any).user) {
        return res
            .status(401)
            .json(new ApiResponse(401, 'Not logged in', { isLoggedIn: false }));
    }

    return res.status(200).json(
        new ApiResponse(200, 'User is logged in', {
            isLoggedIn: true,
            userId: (req as any).user._id,
        }),
    );
});
