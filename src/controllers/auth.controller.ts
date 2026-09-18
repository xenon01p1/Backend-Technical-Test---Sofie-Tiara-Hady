import type { Request, Response, NextFunction } from 'express';

import * as authService from '../services/auth.service.js';
import {
  registerSchema,
  loginSchema,
} from '../validators/auth.validator.js';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = registerSchema.parse(req.body);

    const user = await authService.register(data);

    res.status(201).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const data = loginSchema.parse(req.body);

    const result = await authService.login(data);

    res.status(200).json({
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required.',
        },
      });
      return;
    }

    const user = await authService.getMe(userId);

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};