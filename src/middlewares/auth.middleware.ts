import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import type { JwtPayload } from '../types/auth.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not configured.');
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new Error('Missing authorization header.');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new Error('Invalid authorization header.');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = decoded;

    next();
  } catch {
    next(
      new Error('Invalid or expired authentication token.')
    );
  }
};