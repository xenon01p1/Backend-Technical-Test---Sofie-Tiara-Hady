import { z } from 'zod';
export const createProductSchema = z.object({
    sku: z.string().trim().min(1).max(100),
    name: z.string().trim().min(1).max(255),
    unit: z.string().trim().min(1).max(50),
});
export const updateProductSchema = z.object({
    sku: z.string().trim().min(1).max(100).optional(),
    name: z.string().trim().min(1).max(255).optional(),
    unit: z.string().trim().min(1).max(50).optional(),
    is_active: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided.',
});
export const productIdSchema = z.coerce.number().int().positive();
