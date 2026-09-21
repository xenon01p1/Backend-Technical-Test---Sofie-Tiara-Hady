import { Router } from 'express';
import { createGoodsReceipt, getGoodsReceiptById, } from '../controllers/goods-receipt.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
const router = Router();
router.post('/', authenticate, authorize('USER'), createGoodsReceipt);
router.get('/:id', authenticate, authorize('USER', 'APPROVER', 'ADMIN'), getGoodsReceiptById);
export default router;
