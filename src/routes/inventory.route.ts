import { Router } from 'express';
import { getInventory } from '../controllers/inventory.controller.js';

const router = Router();

router.get('/', getInventory);

export default router;

// GET /inventory
// GET /inventory?warehouse_id=1
// GET /inventory?product_id=10
// GET /inventory?warehouse_id=1&product_id=10
// GET /inventory?warehouse_id=1&cursor=20&limit=10