import { db } from '../config/database.js';
import type {
  CreateWarehouseRequest,
  Warehouse,
  UpdateWarehouseRequest,
  WarehouseFilter,
} from '../types/warehouse.js';

export const createWarehouse = async (
  data: CreateWarehouseRequest
): Promise<Warehouse> => {
  const [result] = await db.execute(
    `
      INSERT INTO warehouses (
        code,
        name,
        location,
        is_active
      )
      VALUES (?, ?, ?, 1)
    `,
    [
      data.code,
      data.name,
      data.location ?? null,
    ]
  );

  const insertId = (result as { insertId: number }).insertId;

  const [rows] = await db.execute(
    `
      SELECT *
      FROM warehouses
      WHERE id = ?
    `,
    [insertId]
  );

  return (rows as Warehouse[])[0];
};

export const getWarehouses = async (): Promise<Warehouse[]> => {
  const [rows] = await db.execute(
    `
      SELECT *
      FROM warehouses
      ORDER BY id DESC
    `
  );

  return rows as Warehouse[];
};

export const getWarehouseById = async (
  id: number
): Promise<Warehouse | null> => {
  const [rows] = await db.execute(
    `
      SELECT *
      FROM warehouses
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  const warehouses = rows as Warehouse[];

  return warehouses[0] ?? null;
};

export const getWarehouseByCode = async (
  code: string
): Promise<Warehouse | null> => {
  const [rows] = await db.execute(
    `
      SELECT *
      FROM warehouses
      WHERE code = ?
      LIMIT 1
    `,
    [code]
  );

  const warehouses = rows as Warehouse[];

  return warehouses[0] ?? null;
};

export const updateWarehouse = async (
  id: number,
  data: UpdateWarehouseRequest
): Promise<Warehouse | null> => {
  const fields: string[] = [];
  const values: (string | number | boolean | null)[] = [];

  if (data.code !== undefined) {
    fields.push('code = ?');
    values.push(data.code);
  }

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }

  if (data.location !== undefined) {
    fields.push('location = ?');
    values.push(data.location);
  }

  if (data.is_active !== undefined) {
    fields.push('is_active = ?');
    values.push(data.is_active);
  }

  values.push(id);

  await db.execute(
    `
      UPDATE warehouses
      SET ${fields.join(', ')}
      WHERE id = ?
    `,
    values
  );

  return getWarehouseById(id);
};

export const deleteWarehouse = async (
  id: number
): Promise<void> => {
  await db.execute(
    `
      DELETE FROM warehouses
      WHERE id = ?
    `,
    [id]
  );
};

export const getWarehousesByCursor = async (
  filter: WarehouseFilter
): Promise<Warehouse[]> => {
  const conditions: string[] = [];
  const values: (string | number | boolean)[] = [];

  if (filter.code) {
    conditions.push('code LIKE ?');
    values.push(`%${filter.code}%`);
  }

  if (filter.name) {
    conditions.push('name LIKE ?');
    values.push(`%${filter.name}%`);
  }

  if (filter.location) {
    conditions.push('location LIKE ?');
    values.push(`%${filter.location}%`);
  }

  if (filter.is_active !== undefined) {
    conditions.push('is_active = ?');
    values.push(filter.is_active);
  }

  if (filter.cursor) {
    conditions.push('id < ?');
    values.push(filter.cursor);
  }

  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

  const [rows] = await db.execute(
    `
      SELECT *
      FROM warehouses
      ${whereClause}
      ORDER BY id DESC
      LIMIT ?
    `,
    [...values, filter.limit ?? 10]
  );

  return rows as Warehouse[];
};