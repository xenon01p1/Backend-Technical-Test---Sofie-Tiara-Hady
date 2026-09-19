import { Router } from 'express';
import { createSupplier, deleteSupplier, getSupplierById, getSuppliers, updateSupplier, getSuppliersByCursor, } from '../controllers/supplier.controller.js';
const router = Router();
router.post('/', createSupplier);
router.get('/', getSuppliers);
router.get('/search', getSuppliersByCursor);
// Example:
// http://localhost:3000/suppliers/search?name=acme&email=acme@example.com&phone=0812&is_active=true&cursor=20&limit=10
router.get('/:id', getSupplierById);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);
export default router;
