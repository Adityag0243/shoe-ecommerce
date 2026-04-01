import { z } from 'zod';

export const createCategorySchema = z.object({
    body: z.object({
        name: z.enum(['shoes', 'clogs']),
    }),
    query: z.any().optional(),
    params: z.any().optional(),
});
