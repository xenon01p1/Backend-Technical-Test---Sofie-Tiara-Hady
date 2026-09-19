import { db } from '../config/database.js';
export const createWarehouse = async (data) => {
    const [result] = await db.execute(`
      INSERT INTO warehouses (
        code,
        name,
        location,
        is_active
      )
      VALUES (?, ?, ?, 1)
    `, [
        data.code,
        data.name,
        data.location ?? null,
    ]);
    const insertId = result.insertId;
    const [rows] = await db.execute(`
      SELECT *
      FROM warehouses
      WHERE id = ?
    `, [insertId]);
    return rows[0];
};
export const getWarehouses = async () => {
    const [rows] = await db.execute(`
      SELECT *
      FROM warehouses
      ORDER BY id DESC
    `);
    return rows;
};
export const getWarehouseById = async (id) => {
    const [rows] = await db.execute(`
      SELECT *
      FROM warehouses
      WHERE id = ?
      LIMIT 1
    `, [id]);
    const warehouses = rows;
    return warehouses[0] ?? null;
};
export const getWarehouseByCode = async (code) => {
    const [rows] = await db.execute(`
      SELECT *
      FROM warehouses
      WHERE code = ?
      LIMIT 1
    `, [code]);
    const warehouses = rows;
    return warehouses[0] ?? null;
};
export const updateWarehouse = async (id, data) => {
    const fields = [];
    const values = [];
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
    await db.execute(`
      UPDATE warehouses
      SET ${fields.join(', ')}
      WHERE id = ?
    `, values);
    return getWarehouseById(id);
};
export const deleteWarehouse = async (id) => {
    await db.execute(`
      DELETE FROM warehouses
      WHERE id = ?
    `, [id]);
};
export const getWarehousesByCursor = async (filter) => {
    const conditions = [];
    const values = [];
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
    const whereClause = conditions.length > 0
        ? `WHERE ${conditions.join(' AND ')}`
        : '';
    const [rows] = await db.execute(`
      SELECT *
      FROM warehouses
      ${whereClause}
      ORDER BY id DESC
      LIMIT ?
    `, [...values, filter.limit ?? 10]);
    return rows;
};
