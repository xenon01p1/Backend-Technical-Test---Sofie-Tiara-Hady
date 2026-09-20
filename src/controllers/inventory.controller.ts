import type { Request, Response, NextFunction } from 'express';
import * as inventoryService from '../services/inventory.service.js';
import { inventoryFilterSchema } from '../validators/inventory.validator.js';

export const getInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filter = inventoryFilterSchema.parse(req.query);

    const result = await inventoryService.getInventoryByCursor(filter);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};