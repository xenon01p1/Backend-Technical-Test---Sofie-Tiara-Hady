import { db } from '../config/database.js';
import type {
  InventoryMovement,
  InventoryMovementFilter,
  InventoryMovementListResponse,
} from '../types/inventory-movement.js';

export const getInventoryMovementsByCursor = async (
  filter: InventoryMovementFilter
): Promise<InventoryMovementListResponse> => {
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
      FROM inventory_movements
      ${whereClause}
      ORDER BY id DESC
      LIMIT ?
    `,
    [...values, limit]
  );

  const movements = rows as InventoryMovement[];

  return {
    data: movements,
    pagination: {
      limit,
      next_cursor:
        movements.length === limit
          ? movements[movements.length - 1].id
          : null,
    },
  };
};