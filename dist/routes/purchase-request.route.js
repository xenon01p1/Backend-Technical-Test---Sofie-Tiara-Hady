import { Router } from 'express';
import { createPurchaseRequest, getPurchaseRequests, getPurchaseRequestById, updatePurchaseRequest, submitPurchaseRequest, approvePurchaseRequest, rejectPurchaseRequest, } from '../controllers/purchase-request.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
const router = Router();
// USER
router.post('/', authenticate, authorize('USER'), createPurchaseRequest);
router.put('/:id', authenticate, authorize('USER'), updatePurchaseRequest);
router.post('/:id/submit', authenticate, authorize('USER'), submitPurchaseRequest);
// USER, APPROVER, ADMIN
router.get('/', authenticate, authorize('USER', 'APPROVER', 'ADMIN'), getPurchaseRequests);
router.get('/:id', authenticate, authorize('USER', 'APPROVER', 'ADMIN'), getPurchaseRequestById);
// APPROVER
router.post('/:id/approve', authenticate, authorize('APPROVER'), approvePurchaseRequest);
router.post('/:id/reject', authenticate, authorize('APPROVER'), rejectPurchaseRequest);
export default router;
