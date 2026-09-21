import type { Request, Response, NextFunction } from 'express';

import * as inventoryService from '../services/inventory.service.js';
import { inventoryFilterSchema } from '../validators/inventory.validator.js';
import { logRequest } from '../utils/logger.js';

export const getInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const startTime = Date.now();

  try {
    const filter = inventoryFilterSchema.parse(req.query);

    const result = await inventoryService.getInventoryByCursor(filter);

    logRequest(
      'GET',
      '/inventory',
      true,
      `Retrieved inventory records=${result.data.length}`,
      startTime
    );

    res.status(200).json(result);
  } catch (error) {
    logRequest(
      'GET',
      '/inventory',
      false,
      'Failed to retrieve inventory',
      startTime
    );

    next(error);
  }
};