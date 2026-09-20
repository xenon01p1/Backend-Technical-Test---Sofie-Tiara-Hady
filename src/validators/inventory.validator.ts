import { z } from 'zod';

export const inventoryFilterSchema = z.object({
  warehouse_id: z.coerce.number().int().positive().optional(),
  product_id: z.coerce.number().int().positive().optional(),
  cursor: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).default(10),
});