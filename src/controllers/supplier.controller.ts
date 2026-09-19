import type { Request, Response, NextFunction } from 'express';
import * as supplierService from '../services/supplier.service.js';
import {
  createSupplierSchema,
  supplierIdSchema,
  updateSupplierSchema,
  supplierFilterSchema,
} from '../validators/supplier.validator.js';
import { logRequest } from '../utils/logger.js';

export const createSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const startTime = Date.now();

  try {
    const data = createSupplierSchema.parse(req.body);
    const supplier = await supplierService.createSupplier(data);

    logRequest(
      'POST',
      '/suppliers',
      true,
      `Created supplier id=${supplier.id}`,
      startTime
    );

    res.status(201).json({
      data: supplier,
    });
  } catch (error) {
    logRequest(
      'POST',
      '/suppliers',
      false,
      'Request failed',
      startTime
    );

    next(error);
  }
};

export const getSuppliers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const startTime = Date.now();

  try {
    const suppliers = await supplierService.getSuppliers();

    logRequest(
      'GET',
      '/suppliers',
      true,
      `count=${suppliers.length}`,
      startTime
    );

    res.status(200).json({
      data: suppliers,
    });
  } catch (error) {
    logRequest(
      'GET',
      '/suppliers',
      false,
      'Request failed',
      startTime
    );

    next(error);
  }
};

export const getSupplierById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const startTime = Date.now();

  try {
    const id = supplierIdSchema.parse(req.params.id);

    const supplier = await supplierService.getSupplierById(id);

    logRequest(
      'GET',
      `/suppliers/${id}`,
      true,
      'Found supplier',
      startTime
    );

    res.status(200).json({
      data: supplier,
    });
  } catch (error) {
    logRequest(
      'GET',
      `/suppliers/${req.params.id}`,
      false,
      'Request failed',
      startTime
    );

    next(error);
  }
};

export const updateSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const startTime = Date.now();

  try {
    const id = supplierIdSchema.parse(req.params.id);
    const data = updateSupplierSchema.parse(req.body);

    const supplier = await supplierService.updateSupplier(id, data);

    logRequest(
      'PUT',
      `/suppliers/${id}`,
      true,
      'Updated supplier',
      startTime
    );

    res.status(200).json({
      data: supplier,
    });
  } catch (error) {
    logRequest(
      'PUT',
      `/suppliers/${req.params.id}`,
      false,
      'Request failed',
      startTime
    );

    next(error);
  }
};

export const deleteSupplier = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const startTime = Date.now();

  try {
    const id = supplierIdSchema.parse(req.params.id);

    const supplier = await supplierService.deleteSupplier(id);

    logRequest(
      'DELETE',
      `/suppliers/${id}`,
      true,
      `Deleted supplier id=${id}`,
      startTime
    );

    res.status(200).json({
      data: supplier,
    });
  } catch (error) {
    logRequest(
      'DELETE',
      `/suppliers/${req.params.id}`,
      false,
      'Request failed',
      startTime
    );

    next(error);
  }
};

export const getSuppliersByCursor = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const startTime = Date.now();

  try {
    const filter = supplierFilterSchema.parse(req.query);

    const suppliers =
      await supplierService.getSuppliersByCursor(filter);

    logRequest(
      'GET',
      '/suppliers/search',
      true,
      `count=${suppliers.length}`,
      startTime
    );

    res.status(200).json({
      data: suppliers,
    });
  } catch (error) {
    logRequest(
      'GET',
      '/suppliers/search',
      false,
      'Request failed',
      startTime
    );

    next(error);
  }
};