// routes/inventory-movement.route.ts
import { Router } from 'express';
import { getInventoryMovements } from '../controllers/inventory-movement.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
const router = Router();
router.get('/', authenticate, authorize('USER', 'APPROVER', 'ADMIN'), getInventoryMovements);
export default router;
