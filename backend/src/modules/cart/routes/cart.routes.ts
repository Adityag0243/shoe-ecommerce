import { Router } from 'express';

import { authMiddleware } from '../../../infrastructure/middlewares/auth.middleware.js';
import { validate } from '../../../infrastructure/middlewares/validate.middleware.js';
import {
    addToCart,
    clearCart,
    getCart,
    removeFromCart,
} from '../services/cart.service.js';
import { addToCartSchema } from '../validators/cart.validators.js';

const router = Router();

router.get('/', authMiddleware, getCart);
router.post('/', authMiddleware, validate(addToCartSchema), addToCart);
router.delete('/userCart/clear', authMiddleware, clearCart);
router.delete('/:id', authMiddleware, removeFromCart);

export default router;
