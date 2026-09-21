import { z } from 'zod';

const purchaseRequestItemSchema = z.object({
  product_id: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
});

export const createPurchaseRequestSchema = z.object({
  warehouse_id: z.coerce.number().int().positive(),
  items: z
    .array(purchaseRequestItemSchema)
    .min(1, 'Purchase Request must have at least one item.'),
}).refine(
  (data) => {
    const productIds = data.items.map((item) => item.product_id);
    return new Set(productIds).size === productIds.length;
  },
  {
    message: 'The same product cannot appear more than once.',
    path: ['items'],
  }
);

export const updatePurchaseRequestSchema = z
  .object({
    warehouse_id: z.coerce.number().int().positive().optional(),
    items: z.array(purchaseRequestItemSchema).min(1).optional(),
  })
  .refine(
    (data) => {
      if (!data.items) {
        return true;
      }

      const productIds = data.items.map((item) => item.product_id);

      return new Set(productIds).size === productIds.length;
    },
    {
      message: 'The same product cannot appear more than once.',
      path: ['items'],
    }
  )
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: 'At least one field must be provided.',
    }
  );

export const purchaseRequestFilterSchema = z.object({
  status: z
    .enum(['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED'])
    .optional(),

  requested_by: z.coerce.number().int().positive().optional(),

  cursor: z.coerce.number().int().positive().optional(),

  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const purchaseRequestIdSchema =
  z.coerce.number().int().positive();