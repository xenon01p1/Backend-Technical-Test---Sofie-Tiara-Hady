import { db } from '../config/database.js';
export const createSupplier = async (data) => {
    const [result] = await db.execute(`
      INSERT INTO suppliers (
        name,
        email,
        phone,
        is_active
      )
      VALUES (?, ?, ?, 1)
    `, [
        data.name,
        data.email ?? null,
        data.phone ?? null,
    ]);
    const insertId = result.insertId;
    const [rows] = await db.execute(`
      SELECT *
      FROM suppliers
      WHERE id = ?
    `, [insertId]);
    return rows[0];
};
export const getSuppliers = async () => {
    const [rows] = await db.execute(`
      SELECT *
      FROM suppliers
      ORDER BY id DESC
    `);
    return rows;
};
export const getSupplierById = async (id) => {
    const [rows] = await db.execute(`
      SELECT *
      FROM suppliers
      WHERE id = ?
      LIMIT 1
    `, [id]);
    const suppliers = rows;
    return suppliers[0] ?? null;
};
export const updateSupplier = async (id, data) => {
    const fields = [];
    const values = [];
    if (data.name !== undefined) {
        fields.push('name = ?');
        values.push(data.name);
    }
    if (data.email !== undefined) {
        fields.push('email = ?');
        values.push(data.email);
    }
    if (data.phone !== undefined) {
        fields.push('phone = ?');
        values.push(data.phone);
    }
    if (data.is_active !== undefined) {
        fields.push('is_active = ?');
        values.push(data.is_active);
    }
    values.push(id);
    await db.execute(`
      UPDATE suppliers
      SET ${fields.join(', ')}
      WHERE id = ?
    `, values);
    return getSupplierById(id);
};
export const deleteSupplier = async (id) => {
    await db.execute(`
      DELETE FROM suppliers
      WHERE id = ?
    `, [id]);
};
export const getSuppliersByCursor = async (filter) => {
    const conditions = [];
    const values = [];
    if (filter.name) {
        conditions.push('name LIKE ?');
        values.push(`%${filter.name}%`);
    }
    if (filter.email) {
        conditions.push('email LIKE ?');
        values.push(`%${filter.email}%`);
    }
    if (filter.phone) {
        conditions.push('phone LIKE ?');
        values.push(`%${filter.phone}%`);
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
      FROM suppliers
      ${whereClause}
      ORDER BY id DESC
      LIMIT ?
    `, [...values, filter.limit ?? 10]);
    return rows;
};
