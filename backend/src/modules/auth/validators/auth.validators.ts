import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        fullName: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
    }),
    query: z.any().optional(),
    params: z.any().optional(),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(1),
    }),
    query: z.any().optional(),
    params: z.any().optional(),
});
