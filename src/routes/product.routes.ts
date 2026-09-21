import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  getProductsByCursor
} from '../controllers/product.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.post('/', authenticate, authorize('ADMIN'), createProduct);
router.get('/', authenticate, getProducts);
router.get('/search', authenticate, getProductsByCursor);
// http://localhost:3000/products/search?name=keyboard&sku=KB&unit=pcs&is_active=true&cursor=20&limit=10
router.get('/:id', authenticate, getProductById);
router.put('/:id', authenticate, authorize('ADMIN'), updateProduct);
router.delete('/:id', deleteProduct);

export default router;