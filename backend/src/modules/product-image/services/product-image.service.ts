import type { Request, Response } from 'express';

import { uploadToCloudinary } from '../../../infrastructure/middlewares/upload.middleware.js';
import { ApiResponse } from '../../../shared/responses/api-response.builder.js';
import { asyncHandler } from '../../../shared/utils/async-handler.util.js';
import { ProductImage } from '../repositories/product-image.model.js';

export const addProductImageById = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const files = (req as any).files as Record<
            string,
            Array<{ buffer: Buffer }>
        >;
        const uploadedImages: any = {};

        if (files?.thumbnail?.[0]) {
            const result = await uploadToCloudinary(
                files.thumbnail[0].buffer,
                'ecommerce_products',
            );
            uploadedImages.thumbnail = result.secure_url;
        }

        if (files?.hover?.[0]) {
            const result = await uploadToCloudinary(
                files.hover[0].buffer,
                'ecommerce_products',
            );
            uploadedImages.hover = result.secure_url;
        }

        if (files?.sides?.length) {
            uploadedImages.sides = [];
            for (const side of files.sides) {
                const result = await uploadToCloudinary(
                    side.buffer,
                    'ecommerce_products',
                );
                uploadedImages.sides.push(result.secure_url);
            }
        }

        const productImage = await ProductImage.findOneAndUpdate(
            { productId },
            { $set: uploadedImages, productId },
            { new: true, upsert: true },
        );

        res.status(200).json({
            success: true,
            message: 'Images uploaded & saved successfully!',
            productImage,
        });
    } catch (error: any) {
         
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: error?.message });
    }
};

export const getProductImage = asyncHandler(
    async (_req: Request, res: Response) => {
        const productImage = await ProductImage.find();
        res.status(200).json(
            new ApiResponse(
                200,
                'productImage fetched successfully',
                productImage,
            ),
        );
    },
);
