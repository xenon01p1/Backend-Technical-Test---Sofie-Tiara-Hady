import express from 'express';
import productRoutes from './routes/product.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
  });
});

app.use('/products', productRoutes);
app.use('/auth', authRoutes);

app.use(errorMiddleware);

export default app;