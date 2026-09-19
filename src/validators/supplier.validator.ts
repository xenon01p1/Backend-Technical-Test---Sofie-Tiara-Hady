import { z } from 'zod';

export const createSupplierSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: z.string().trim().email().max(255).optional(),
  phone: z.string().trim().min(1).max(50).optional(),
});

export const updateSupplierSchema = z.object({
  name: z.string().trim().min(1).max(255).optional(),
  email: z.string().trim().email().max(255).optional(),
  phone: z.string().trim().min(1).max(50).optional(),
  is_active: z.boolean().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  {
    message: 'At least one field must be provided.',
  }
);

export const supplierFilterSchema = z.object({
  name: z.string().trim().optional(),
  email: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  is_active: z.coerce.boolean().optional(),
  cursor: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const supplierIdSchema = z.coerce.number().int().positive();