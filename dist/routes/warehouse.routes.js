import { Router } from 'express';
import { createWarehouse, deleteWarehouse, getWarehouseById, getWarehouses, updateWarehouse, getWarehousesByCursor, } from '../controllers/warehouse.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
const router = Router();
router.post('/', authenticate, authorize('ADMIN'), createWarehouse);
router.get('/', authenticate, getWarehouses);
router.get('/search', authenticate, getWarehousesByCursor);
// Example:
// http://localhost:3000/warehouses/search?code=WH&name=Jakarta&location=Jakarta&is_active=true&cursor=20&limit=10
router.get('/:id', authenticate, getWarehouseById);
router.put('/:id', authenticate, authorize('ADMIN'), updateWarehouse);
router.delete('/:id', deleteWarehouse);
export default router;
