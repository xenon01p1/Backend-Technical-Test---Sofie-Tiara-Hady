import { z } from 'zod';
export const createWarehouseSchema = z.object({
    code: z.string().trim().min(1).max(50),
    name: z.string().trim().min(1).max(255),
    location: z.string().trim().optional(),
});
export const updateWarehouseSchema = z.object({
    code: z.string().trim().min(1).max(50).optional(),
    name: z.string().trim().min(1).max(255).optional(),
    location: z.string().trim().optional(),
    is_active: z.boolean().optional(),
}).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided.',
});
export const warehouseFilterSchema = z.object({
    code: z.string().trim().optional(),
    name: z.string().trim().optional(),
    location: z.string().trim().optional(),
    is_active: z.coerce.boolean().optional(),
    cursor: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).default(10),
});
export const warehouseIdSchema = z.coerce.number().int().positive();
