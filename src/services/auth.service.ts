import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import * as userRepository from '../repositories/user.repository.js';
import type { User } from '../types/user.js';
import type {
  LoginRequest,
  RegisterRequest,
  JwtPayload,
} from '../types/auth.js';
import { AppError } from '../utils/app-error.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not configured.');
}

export const register = async (
  data: RegisterRequest
): Promise<User> => {
  const existingUsername = await userRepository.getUserByUsername(
    data.username
  );

  if (existingUsername) {
    throw new AppError(
      409,
      'USERNAME_ALREADY_EXISTS',
      'Username already exists.'
    );
  }

  const existingEmail = await userRepository.getUserByEmail(
    data.email
  );

  if (existingEmail) {
    throw new AppError(
      409,
      'EMAIL_ALREADY_EXISTS',
      'Email already exists.'
    );
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return userRepository.createUser(
    data.username,
    data.email,
    hashedPassword,
    data.role,
    data.phone
  );
};

export const login = async (
  data: LoginRequest
): Promise<{ token: string; user: User }> => {
  const user = await userRepository.getUserByUsername(
    data.username
  );

  if (!user) {
    throw new AppError(
      401,
      'INVALID_CREDENTIALS',
      'Invalid username or password.'
    );
  }

  if (!user.is_active) {
    throw new AppError(
      403,
      'USER_INACTIVE',
      'User account is inactive.'
    );
  }

  const passwordMatches = await bcrypt.compare(
    data.password,
    user.pass
  );

  if (!passwordMatches) {
    throw new AppError(
      401,
      'INVALID_CREDENTIALS',
      'Invalid username or password.'
    );
  }

  const payload: JwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1h',
  });

  const { pass: _pass, ...safeUser } = user;

  return {
    token,
    user: safeUser,
  };
};

export const getMe = async (
  userId: number
): Promise<User> => {
  const user = await userRepository.getUserById(userId);

  if (!user) {
    throw new AppError(
      404,
      'USER_NOT_FOUND',
      'User not found.'
    );
  }

  if (!user.is_active) {
    throw new AppError(
      403,
      'USER_INACTIVE',
      'User account is inactive.'
    );
  }

  return user;
};