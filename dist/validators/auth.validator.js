import { z } from 'zod';
export const registerSchema = z.object({
    username: z.string().trim().min(3).max(50),
    email: z.string().trim().email().max(255),
    password: z.string().min(8).max(72),
    phone: z.string().trim().max(50).optional(),
});
export const loginSchema = z.object({
    username: z.string().trim().min(1).max(50),
    password: z.string().min(1),
});
