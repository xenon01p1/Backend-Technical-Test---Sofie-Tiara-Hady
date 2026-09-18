import { db } from '../config/database.js';
export const getUserByUsername = async (username) => {
    const [rows] = await db.execute(`
      SELECT *
      FROM users
      WHERE username = ?
      LIMIT 1
    `, [username]);
    const users = rows;
    return users[0] ?? null;
};
export const getUserByEmail = async (email) => {
    const [rows] = await db.execute(`
      SELECT
        *
      FROM users
      WHERE email = ?
      LIMIT 1
    `, [email]);
    const users = rows;
    return users[0] ?? null;
};
export const getUserById = async (id) => {
    const [rows] = await db.execute(`
      SELECT
        *
      FROM users
      WHERE id = ?
      LIMIT 1
    `, [id]);
    const users = rows;
    return users[0] ?? null;
};
export const createUser = async (username, email, hashedPassword, phone) => {
    const [result] = await db.execute(`
      INSERT INTO users (
        username,
        email,
        pass,
        phone,
        role,
        is_active
      )
      VALUES (?, ?, ?, ?, 'STAFF', 1)
    `, [username, email, hashedPassword, phone ?? null]);
    const insertId = result.insertId;
    const user = await getUserById(insertId);
    return user;
};
