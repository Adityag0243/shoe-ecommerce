import { Router } from 'express';

import { authMiddleware } from '../../../infrastructure/middlewares/auth.middleware.js';
import {
    addFavourite,
    getFavourites,
    getProfile,
    removeFavourite,
    updateProfile,
} from '../services/user.service.js';

const router = Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

router.post('/favourites', authMiddleware, addFavourite);
router.get('/favourites', authMiddleware, getFavourites);
router.delete('/favourites/:id', authMiddleware, removeFavourite);

export default router;
