import { db } from '../config/database.js';
import type {
  Inventory,
  InventoryFilter,
  InventoryListResponse,
} from '../types/inventory.js';

export const getInventoryByCursor = async (
  filter: InventoryFilter
): Promise<InventoryListResponse> => {
  const conditions: string[] = [];
  const values: (string | number)[] = [];

  if (filter.warehouse_id !== undefined) {
    conditions.push('warehouse_id = ?');
    values.push(filter.warehouse_id);
  }

  if (filter.product_id !== undefined) {
    conditions.push('product_id = ?');
    values.push(filter.product_id);
  }

  if (filter.cursor !== undefined) {
    conditions.push('id < ?');
    values.push(filter.cursor);
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

  const limit = filter.limit ?? 10;

  const [rows] = await db.execute(
    `
      SELECT *
      FROM inventories
      ${whereClause}
      ORDER BY id DESC
      LIMIT ?
    `,
    [...values, limit]
  );

  const inventory = rows as Inventory[];

  return {
    data: inventory,
    pagination: {
      limit,
      next_cursor:
        inventory.length === limit
          ? inventory[inventory.length - 1].id
          : null,
    },
  };
};