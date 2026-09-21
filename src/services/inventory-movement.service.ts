// services/inventory-movement.service.ts

import * as inventoryMovementRepository from '../repositories/inventory-movement.repository.js';
import type {
  InventoryMovementFilter,
  InventoryMovementListResponse,
} from '../types/inventory-movement.js';

export const getInventoryMovementsByCursor = async (
  filter: InventoryMovementFilter
): Promise<InventoryMovementListResponse> => {
  return inventoryMovementRepository.getInventoryMovementsByCursor(
    filter
  );
};