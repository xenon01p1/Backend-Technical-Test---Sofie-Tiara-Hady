import type { Request, Response, NextFunction } from 'express';
import type { UserRole } from '../types/user.js';
import { AppError } from '../utils/app-error.js';

export const authorize = (...allowedRoles: UserRole[]) => {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      next(
        new AppError(
          401,
          'UNAUTHORIZED',
          'Authentication required.'
        )
      );
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(
        new AppError(
          403,
          'FORBIDDEN',
          'Insufficient permissions.'
        )
      );
      return;
    }

    next();
  };
};