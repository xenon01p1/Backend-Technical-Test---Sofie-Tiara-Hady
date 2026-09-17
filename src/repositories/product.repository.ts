import { db } from '../config/database.js';
import type {
  CreateProductRequest,
  Product,
  UpdateProductRequest,
} from '../types/product.js';
import mysql from 'mysql2/promise';

export const createProduct = async (
  data: CreateProductRequest
): Promise<Product> => {
  const [result] = await db.execute(
    `
      INSERT INTO products (
        sku,
        name,
        unit,
        is_active
      )
      VALUES (?, ?, ?, 1)
    `,
    [data.sku, data.name, data.unit]
  );

  const insertId = (result as { insertId: number }).insertId;

  const [rows] = await db.execute(
    `
      SELECT *
      FROM products
      WHERE id = ?
    `,
    [insertId]
  );

  return (rows as Product[])[0];
};

export const getProducts = async (): Promise<Product[]> => {
  const [rows] = await db.execute(
    `
      SELECT *
      FROM products
      ORDER BY id DESC
    `
  );

  return rows as Product[];
};

export const getProductById = async (
  id: number
): Promise<Product | null> => {
  const [rows] = await db.execute(
    `
      SELECT *
      FROM products
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  const products = rows as Product[];

  return products[0] ?? null;
};

export const getProductBySku = async (
  sku: string
): Promise<Product | null> => {
  const [rows] = await db.execute(
    `
      SELECT *
      FROM products
      WHERE sku = ?
      LIMIT 1
    `,
    [sku]
  );

  const products = rows as Product[];

  return products[0] ?? null;
};

export const updateProduct = async (
  id: number,
  data: UpdateProductRequest
): Promise<Product | null> => {
  const fields: string[] = [];
  const values: (string | number | boolean | null)[] = [];

  if (data.sku !== undefined) {
    fields.push('sku = ?');
    values.push(data.sku);
  }

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }

  if (data.unit !== undefined) {
    fields.push('unit = ?');
    values.push(data.unit);
  }

  if (data.is_active !== undefined) {
    fields.push('is_active = ?');
    values.push(data.is_active);
  }

  values.push(id);

  await db.execute(
    `
      UPDATE products
      SET ${fields.join(', ')}
      WHERE id = ?
    `,
    values
  );

  return getProductById(id);
};

export const deactivateProduct = async (
  id: number
): Promise<Product | null> => {
  await db.execute(
    `
      UPDATE products
      SET is_active = 0
      WHERE id = ?
    `,
    [id]
  );

  return getProductById(id);
};