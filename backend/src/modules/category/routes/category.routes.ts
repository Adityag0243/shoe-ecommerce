import { Router } from 'express';

import {
    adminMiddleware,
    authMiddleware,
} from '../../../infrastructure/middlewares/auth.middleware.js';
import { validate } from '../../../infrastructure/middlewares/validate.middleware.js';
import { createCategory, getCategories } from '../services/category.service.js';
import { createCategorySchema } from '../validators/category.validators.js';

const router = Router();

router.post(
    '/',
    authMiddleware,
    adminMiddleware,
    validate(createCategorySchema),
    createCategory,
);
router.get('/', getCategories);

export default router;
