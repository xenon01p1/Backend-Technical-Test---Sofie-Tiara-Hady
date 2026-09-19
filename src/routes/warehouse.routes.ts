import { Router } from 'express';
import {
  createWarehouse,
  deleteWarehouse,
  getWarehouseById,
  getWarehouses,
  updateWarehouse,
  getWarehousesByCursor,
} from '../controllers/warehouse.controller.js';

const router = Router();

router.post('/', createWarehouse);
router.get('/', getWarehouses);
router.get('/search', getWarehousesByCursor);

// Example:
// http://localhost:3000/warehouses/search?code=WH&name=Jakarta&location=Jakarta&is_active=true&cursor=20&limit=10

router.get('/:id', getWarehouseById);
router.put('/:id', updateWarehouse);
router.delete('/:id', deleteWarehouse);

export default router;