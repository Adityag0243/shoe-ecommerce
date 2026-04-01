import { z } from 'zod';

export const createStripePaymentSchema = z.object({
    body: z.object({
        orderId: z.string().min(1),
        amount: z.number().positive(),
    }),
    query: z.any().optional(),
    params: z.any().optional(),
});

export const confirmPaymentSchema = z.object({
    body: z.object({
        transactionId: z.string().min(1),
        status: z.enum(['pending', 'success', 'failed']),
    }),
    query: z.any().optional(),
    params: z.any().optional(),
});
