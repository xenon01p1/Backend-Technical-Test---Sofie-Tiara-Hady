import * as inventoryRepository from '../repositories/inventory.repository.js';
import type {
  InventoryFilter,
  InventoryListResponse,
} from '../types/inventory.js';

export const getInventoryByCursor = async (
  filter: InventoryFilter
): Promise<InventoryListResponse> => {
  return inventoryRepository.getInventoryByCursor(filter);
};