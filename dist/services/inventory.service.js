import * as inventoryRepository from '../repositories/inventory.repository.js';
export const getInventoryByCursor = async (filter) => {
    return inventoryRepository.getInventoryByCursor(filter);
};
