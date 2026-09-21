import type { Request, Response, NextFunction } from 'express';

import * as goodsReceiptService from '../services/goods-receipt.service.js';

import {
  createGoodsReceiptSchema,
  goodsReceiptIdSchema,
} from '../validators/goods-receipt.validator.js';

import { logRequest } from '../utils/logger.js';

export const createGoodsReceipt = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const startTime = Date.now();

  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new Error('Authentication required.');
    }

    const data = createGoodsReceiptSchema.parse(req.body);

    const goodsReceipt =
      await goodsReceiptService.createGoodsReceipt(
        userId,
        data
      );

    logRequest(
      'POST',
      '/goods-receipts',
      true,
      `Created goods receipt id=${goodsReceipt.id}`,
      startTime
    );

    res.status(201).json({
      data: goodsReceipt,
    });
  } catch (error) {
    logRequest(
      'POST',
      '/goods-receipts',
      false,
      'Failed to create goods receipt',
      startTime
    );

    next(error);
  }
};

export const getGoodsReceiptById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const startTime = Date.now();

  try {
    const userId = req.user?.userId;
    const role = req.user?.role;

    if (!userId || !role) {
      throw new Error('Authentication required.');
    }

    const id = goodsReceiptIdSchema.parse(req.params.id);

    const goodsReceipt =
      await goodsReceiptService.getGoodsReceiptById(
        id,
        userId,
        role
      );

    logRequest(
      'GET',
      `/goods-receipts/${id}`,
      true,
      `Retrieved goods receipt id=${id}`,
      startTime
    );

    res.status(200).json({
      data: goodsReceipt,
    });
  } catch (error) {
    logRequest(
      'GET',
      `/goods-receipts/${req.params.id}`,
      false,
      'Failed to retrieve goods receipt',
      startTime
    );

    next(error);
  }
};