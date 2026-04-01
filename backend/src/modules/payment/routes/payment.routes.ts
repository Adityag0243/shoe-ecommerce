import { Router } from 'express';

import { authMiddleware } from '../../../infrastructure/middlewares/auth.middleware.js';
import { validate } from '../../../infrastructure/middlewares/validate.middleware.js';
import {
    confirmPayment,
    createStripePayment,
} from '../services/payment.service.js';
import {
    confirmPaymentSchema,
    createStripePaymentSchema,
} from '../validators/payment.validators.js';

const router = Router();

router.post(
    '/stripe',
    authMiddleware,
    validate(createStripePaymentSchema),
    createStripePayment,
);
router.post(
    '/confirm',
    authMiddleware,
    validate(confirmPaymentSchema),
    confirmPayment,
);

export default router;
