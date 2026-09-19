import * as warehouseRepository from '../repositories/warehouse.repository.js';
import type {
  CreateWarehouseRequest,
  Warehouse,
  UpdateWarehouseRequest,
  WarehouseFilter,
} from '../types/warehouse.js';
import { AppError } from '../utils/app-error.js';

export const createWarehouse = async (
  data: CreateWarehouseRequest
): Promise<Warehouse> => {
  const existingWarehouse =
    await warehouseRepository.getWarehouseByCode(data.code);

  if (existingWarehouse) {
    throw new AppError(
      409,
      'WAREHOUSE_CODE_ALREADY_EXISTS',
      'Warehouse code already exists.'
    );
  }

  return warehouseRepository.createWarehouse(data);
};

export const getWarehouses = async (): Promise<Warehouse[]> => {
  return warehouseRepository.getWarehouses();
};

export const getWarehousesByCursor = async (
  filter: WarehouseFilter
): Promise<Warehouse[]> => {
  return warehouseRepository.getWarehousesByCursor(filter);
};

export const getWarehouseById = async (
  id: number
): Promise<Warehouse> => {
  const warehouse = await warehouseRepository.getWarehouseById(id);

  if (!warehouse) {
    throw new AppError(
      404,
      'WAREHOUSE_NOT_FOUND',
      'Warehouse not found.'
    );
  }

  return warehouse;
};

export const updateWarehouse = async (
  id: number,
  data: UpdateWarehouseRequest
): Promise<Warehouse> => {
  const warehouse = await warehouseRepository.getWarehouseById(id);

  if (!warehouse) {
    throw new AppError(
      404,
      'WAREHOUSE_NOT_FOUND',
      'Warehouse not found.'
    );
  }

  if (data.code !== undefined && data.code !== warehouse.code) {
    const existingWarehouse =
      await warehouseRepository.getWarehouseByCode(data.code);

    if (existingWarehouse && existingWarehouse.id !== id) {
      throw new AppError(
        409,
        'WAREHOUSE_CODE_ALREADY_EXISTS',
        'Warehouse code already exists.'
      );
    }
  }

  const updatedWarehouse =
    await warehouseRepository.updateWarehouse(id, data);

  if (!updatedWarehouse) {
    throw new AppError(
      404,
      'WAREHOUSE_NOT_FOUND',
      'Warehouse not found.'
    );
  }

  return updatedWarehouse;
};

export const deleteWarehouse = async (
  id: number
): Promise<Warehouse> => {
  const warehouse = await warehouseRepository.getWarehouseById(id);

  if (!warehouse) {
    throw new AppError(
      404,
      'WAREHOUSE_NOT_FOUND',
      'Warehouse not found.'
    );
  }

  await warehouseRepository.deleteWarehouse(id);

  return warehouse;
};