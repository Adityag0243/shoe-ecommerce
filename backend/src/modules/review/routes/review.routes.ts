import { Router } from 'express';

import { authMiddleware } from '../../../infrastructure/middlewares/auth.middleware.js';
import { getMyReviews } from '../services/review.service.js';

const router = Router();

router.get('/me', authMiddleware, getMyReviews);

export default router;
