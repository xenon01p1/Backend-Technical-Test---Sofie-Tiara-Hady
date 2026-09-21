import * as purchaseOrderService from '../services/purchase-order.service.js';
import { createPurchaseOrderSchema, purchaseOrderFilterSchema, purchaseOrderIdSchema, } from '../validators/purchase-order.validator.js';
import { logRequest } from '../utils/logger.js';
export const createPurchaseOrder = async (req, res, next) => {
    const startTime = Date.now();
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new Error('Authentication required.');
        }
        const data = createPurchaseOrderSchema.parse(req.body);
        const purchaseOrder = await purchaseOrderService.createPurchaseOrder(userId, data);
        logRequest('POST', '/purchase-orders', true, `Created purchase order id=${purchaseOrder.id}`, startTime);
        res.status(201).json({
            data: purchaseOrder,
        });
    }
    catch (error) {
        logRequest('POST', '/purchase-orders', false, 'Failed to create purchase order', startTime);
        next(error);
    }
};
export const getPurchaseOrders = async (req, res, next) => {
    const startTime = Date.now();
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;
        if (!userId || !role) {
            throw new Error('Authentication required.');
        }
        const filter = purchaseOrderFilterSchema.parse(req.query);
        const result = await purchaseOrderService.getPurchaseOrders(userId, role, filter);
        logRequest('GET', '/purchase-orders', true, `Retrieved purchase orders records=${result.data.length}`, startTime);
        res.status(200).json(result);
    }
    catch (error) {
        logRequest('GET', '/purchase-orders', false, 'Failed to retrieve purchase orders', startTime);
        next(error);
    }
};
export const getPurchaseOrderById = async (req, res, next) => {
    const startTime = Date.now();
    try {
        const userId = req.user?.userId;
        const role = req.user?.role;
        if (!userId || !role) {
            throw new Error('Authentication required.');
        }
        const id = purchaseOrderIdSchema.parse(req.params.id);
        const purchaseOrder = await purchaseOrderService.getPurchaseOrderById(id, userId, role);
        logRequest('GET', `/purchase-orders/${id}`, true, `Retrieved purchase order id=${id}`, startTime);
        res.status(200).json({
            data: purchaseOrder,
        });
    }
    catch (error) {
        logRequest('GET', `/purchase-orders/${req.params.id}`, false, 'Failed to retrieve purchase order', startTime);
        next(error);
    }
};
export const markPurchaseOrderAsOrdered = async (req, res, next) => {
    const startTime = Date.now();
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new Error('Authentication required.');
        }
        const id = purchaseOrderIdSchema.parse(req.params.id);
        const purchaseOrder = await purchaseOrderService.markPurchaseOrderAsOrdered(id, userId);
        logRequest('POST', `/purchase-orders/${id}/order`, true, `Marked purchase order id=${id} as ORDERED`, startTime);
        res.status(200).json({
            data: purchaseOrder,
        });
    }
    catch (error) {
        logRequest('POST', `/purchase-orders/${req.params.id}/order`, false, 'Failed to mark purchase order as ORDERED', startTime);
        next(error);
    }
};
