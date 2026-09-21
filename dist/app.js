import express from 'express';
import productRoutes from './routes/product.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import supplierRoutes from './routes/supplier.routes.js';
import warehouseRoutes from './routes/warehouse.routes.js';
import inventoryRoutes from './routes/inventory.route.js';
import inventoryMovementRoutes from './routes/inventory-movement.route.js';
import purchaseRequestRouter from './routes/purchase-request.route.js';
import purchaseOrderRouter from './routes/purchase-order.routes.js';
import goodsReceiptRouter from './routes/goods-receipt.routes.js';
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
app.use('/suppliers', supplierRoutes);
app.use('/warehouses', warehouseRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/inventory/movements', inventoryMovementRoutes);
app.use('/purchase-requests', purchaseRequestRouter);
app.use('/purchase-orders', purchaseOrderRouter);
app.use('/goods-receipts', goodsReceiptRouter);
app.use(errorMiddleware);
export default app;
