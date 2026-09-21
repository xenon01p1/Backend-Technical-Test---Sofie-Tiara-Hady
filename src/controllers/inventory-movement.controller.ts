import type { Request, Response, NextFunction } from 'express';

import * as inventoryMovementService from '../services/inventory-movement.service.js';
import { inventoryMovementFilterSchema } from '../validators/inventory-movement.validator.js';
import { logRequest } from '../utils/logger.js';

export const getInventoryMovements = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const startTime = Date.now();

  try {
    const filter = inventoryMovementFilterSchema.parse(req.query);

    const result =
      await inventoryMovementService.getInventoryMovementsByCursor(
        filter
      );

    logRequest(
      'GET',
      '/inventory/movements',
      true,
      `Retrieved inventory movements records=${result.data.length}`,
      startTime
    );

    res.status(200).json(result);
  } catch (error) {
    logRequest(
      'GET',
      '/inventory/movements',
      false,
      'Failed to retrieve inventory movements',
      startTime
    );

    next(error);
  }
};