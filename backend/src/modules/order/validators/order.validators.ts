import { z } from 'zod';

export const createOrderSchema = z.object({
    body: z.object({
        totalAmount: z.number().positive(),
        items: z
            .array(
                z.object({
                    productId: z.string().min(1),
                    quantity: z.number().int().positive(),
                    price: z.number().positive(),
                    selectedColor: z.string().optional(),
                    selectedSize: z.string().optional(),
                }),
            )
            .min(1),
    }),
    query: z.any().optional(),
    params: z.any().optional(),
});
