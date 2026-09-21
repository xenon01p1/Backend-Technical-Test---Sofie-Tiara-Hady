import { Router } from 'express';
import {
  createSupplier,
  deleteSupplier,
  getSupplierById,
  getSuppliers,
  updateSupplier,
  getSuppliersByCursor,
} from '../controllers/supplier.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.post('/', authenticate, authorize('ADMIN'), createSupplier);
router.get('/', authenticate, getSuppliers);
router.get('/search', authenticate, getSuppliersByCursor);

// Example:
// http://localhost:3000/suppliers/search?name=acme&email=acme@example.com&phone=0812&is_active=true&cursor=20&limit=10

router.get('/:id', authenticate, getSupplierById);
router.put('/:id', authenticate, authorize('ADMIN'), updateSupplier);
router.delete('/:id', deleteSupplier);

export default router;