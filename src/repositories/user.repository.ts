import { db } from '../config/database.js';
import type { User } from '../types/user.js';

export interface UserWithPassword extends User {
  pass: string;
}

export const getUserByUsername = async (
  username: string
): Promise<UserWithPassword | null> => {
  const [rows] = await db.execute(
    `
      SELECT *
      FROM users
      WHERE username = ?
      LIMIT 1
    `,
    [username]
  );

  const users = rows as UserWithPassword[];

  return users[0] ?? null;
};

export const getUserByEmail = async (
  email: string
): Promise<User | null> => {
  const [rows] = await db.execute(
    `
      SELECT
        *
      FROM users
      WHERE email = ?
      LIMIT 1
    `,
    [email]
  );

  const users = rows as User[];

  return users[0] ?? null;
};

export const getUserById = async (
  id: number
): Promise<User | null> => {
  const [rows] = await db.execute(
    `
      SELECT
        *
      FROM users
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  const users = rows as User[];

  return users[0] ?? null;
};

export const createUser = async (
  username: string,
  email: string,
  hashedPassword: string,
  role: string,
  phone?: string
): Promise<User> => {
  const [result] = await db.execute(
    `
      INSERT INTO users (
        username,
        email,
        pass,
        phone,
        role,
        is_active
      )
      VALUES (?, ?, ?, ?, ?, 1)
    `,
    [username, email, hashedPassword, phone ?? null, role]
  );

  const insertId = (result as { insertId: number }).insertId;

  const user = await getUserById(insertId);

  return user!;
};