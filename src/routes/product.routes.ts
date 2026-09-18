import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  getProductsByCursor
} from '../controllers/product.controller.js';

const router = Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/search', getProductsByCursor);
// http://localhost:3000/products/search?name=keyboard&sku=KB&unit=pcs&is_active=true&cursor=20&limit=10
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;