import { Router } from 'express';
import { getInventory } from '../controllers/inventory.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', authenticate, getInventory);

export default router;

// GET /inventory
// GET /inventory?warehouse_id=1
// GET /inventory?product_id=10
// GET /inventory?warehouse_id=1&product_id=10
// GET /inventory?warehouse_id=1&cursor=20&limit=10