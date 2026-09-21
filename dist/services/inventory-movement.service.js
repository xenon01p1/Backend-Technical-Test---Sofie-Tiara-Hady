// services/inventory-movement.service.ts
import * as inventoryMovementRepository from '../repositories/inventory-movement.repository.js';
export const getInventoryMovementsByCursor = async (filter) => {
    return inventoryMovementRepository.getInventoryMovementsByCursor(filter);
};
