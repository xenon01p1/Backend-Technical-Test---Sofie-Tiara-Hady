import { z } from 'zod';

const goodsReceiptItemSchema = z.object({
  product_id: z.coerce.number().int().positive(),
  quantity: z.coerce.number().int().positive(),
});

export const createGoodsReceiptSchema = z
  .object({
    purchase_order_id: z.coerce.number().int().positive(),

    items: z
      .array(goodsReceiptItemSchema)
      .min(1, 'Goods Receipt must have at least one item.'),
  })
  .refine(
    data => {
      const productIds = data.items.map(item => item.product_id);

      return new Set(productIds).size === productIds.length;
    },
    {
      message: 'The same product cannot appear more than once.',
      path: ['items'],
    }
  );

export const goodsReceiptIdSchema = z.coerce
  .number()
  .int()
  .positive();