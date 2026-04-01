import { Router } from 'express';

import { authMiddleware } from '../../../infrastructure/middlewares/auth.middleware.js';
import { validate } from '../../../infrastructure/middlewares/validate.middleware.js';
import { createOrder, getOrders } from '../services/order.service.js';
import { createOrderSchema } from '../validators/order.validators.js';

const router = Router();

router.post('/', authMiddleware, validate(createOrderSchema), createOrder);
router.get('/', authMiddleware, getOrders);

export default router;
