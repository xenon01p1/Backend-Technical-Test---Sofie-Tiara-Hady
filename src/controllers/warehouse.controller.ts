import type { Request, Response, NextFunction } from 'express';
import * as warehouseService from '../services/warehouse.service.js';
import {
  createWarehouseSchema,
  warehouseIdSchema,
  updateWarehouseSchema,
  warehouseFilterSchema,
} from '../validators/warehouse.validator.js';
import { logRequest } from '../utils/logger.js';

export const createWarehouse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const startTime = Date.now();

  try {
    const data = createWarehouseSchema.parse(req.body);
    const warehouse = await warehouseService.createWarehouse(data);

    logRequest(
      'POST',
      '/warehouses',
      true,
      `Created warehouse id=${warehouse.id}`,
      startTime
    );

    res.status(201).json({
      data: warehouse,
    });
  } catch (error) {
    logRequest(
      'POST',
      '/warehouses',
      false,
      'Request failed',
      startTime
    );

    next(error);
  }
};

export const getWarehouses = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const startTime = Date.now();

  try {
    const warehouses = await warehouseService.getWarehouses();

    logRequest(
      'GET',
      '/warehouses',
      true,
      `count=${warehouses.length}`,
      startTime
    );

    res.status(200).json({
      data: warehouses,
    });
  } catch (error) {
    logRequest(
      'GET',
      '/warehouses',
      false,
      'Request failed',
      startTime
    );

    next(error);
  }
};

export const getWarehouseById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const startTime = Date.now();

  try {
    const id = warehouseIdSchema.parse(req.params.id);

    const warehouse = await warehouseService.getWarehouseById(id);

    logRequest(
      'GET',
      `/warehouses/${id}`,
      true,
      'Found warehouse',
      startTime
    );

    res.status(200).json({
      data: warehouse,
    });
  } catch (error) {
    logRequest(
      'GET',
      `/warehouses/${req.params.id}`,
      false,
      'Request failed',
      startTime
    );

    next(error);
  }
};

export const updateWarehouse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const startTime = Date.now();

  try {
    const id = warehouseIdSchema.parse(req.params.id);
    const data = updateWarehouseSchema.parse(req.body);

    const warehouse = await warehouseService.updateWarehouse(id, data);

    logRequest(
      'PUT',
      `/warehouses/${id}`,
      true,
      'Updated warehouse',
      startTime
    );

    res.status(200).json({
      data: warehouse,
    });
  } catch (error) {
    logRequest(
      'PUT',
      `/warehouses/${req.params.id}`,
      false,
      'Request failed',
      startTime
    );

    next(error);
  }
};

export const deleteWarehouse = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const startTime = Date.now();

  try {
    const id = warehouseIdSchema.parse(req.params.id);

    const warehouse = await warehouseService.deleteWarehouse(id);

    logRequest(
      'DELETE',
      `/warehouses/${id}`,
      true,
      `Deleted warehouse id=${id}`,
      startTime
    );

    res.status(200).json({
      data: warehouse,
    });
  } catch (error) {
    logRequest(
      'DELETE',
      `/warehouses/${req.params.id}`,
      false,
      'Request failed',
      startTime
    );

    next(error);
  }
};

export const getWarehousesByCursor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const startTime = Date.now();

  try {
    const filter = warehouseFilterSchema.parse(req.query);

    const warehouses =
      await warehouseService.getWarehousesByCursor(filter);

    logRequest(
      'GET',
      '/warehouses/search',
      true,
      `count=${warehouses.length}`,
      startTime
    );

    res.status(200).json({
      data: warehouses,
    });
  } catch (error) {
    logRequest(
      'GET',
      '/warehouses/search',
      false,
      'Request failed',
      startTime
    );

    next(error);
  }
};