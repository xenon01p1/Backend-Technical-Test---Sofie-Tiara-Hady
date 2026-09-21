import { Router } from 'express';

import {
  register,
  login,
  getMe,
} from '../controllers/auth.controller.js';

import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', register); // to create temporary account for test
router.post('/login', login);
router.get('/me', authenticate, getMe);

export default router;