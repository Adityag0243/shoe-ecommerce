import express from 'express';

import {
    adminMiddleware,
    authMiddleware,
} from '../../../infrastructure/middlewares/auth.middleware.js';
import { upload } from '../../../infrastructure/middlewares/upload.middleware.js';
import {
    addProductImageById,
    getProductImage,
} from '../services/product-image.service.js';

const router = express.Router();

router.post(
    '/:productId/images',
    authMiddleware,
    adminMiddleware,
    upload.fields([
        { name: 'thumbnail', maxCount: 1 },
        { name: 'hover', maxCount: 1 },
        { name: 'sides', maxCount: 5 },
    ]),
    addProductImageById,
);

router.get('/', getProductImage);

export default router;
