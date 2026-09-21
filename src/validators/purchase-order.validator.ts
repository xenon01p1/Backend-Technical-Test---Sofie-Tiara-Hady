import { z } from 'zod';

export const createPurchaseOrderSchema = z.object({
  purchase_request_id: z.coerce.number().int().positive(),
  supplier_id: z.coerce.number().int().positive(),
});

export const purchaseOrderFilterSchema = z.object({
  status: z
    .enum([
      'DRAFT',
      'ORDERED',
      'PARTIALLY_RECEIVED',
      'RECEIVED',
      'CANCELLED',
    ])
    .optional(),

  supplier_id: z.coerce.number().int().positive().optional(),

  purchase_request_id: z.coerce.number().int().positive().optional(),

  cursor: z.coerce.number().int().positive().optional(),

  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const purchaseOrderIdSchema = z.coerce
  .number()
  .int()
  .positive();