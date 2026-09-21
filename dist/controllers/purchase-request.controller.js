import * as purchaseRequestService from '../services/purchase-request.service.js';
import { createPurchaseRequestSchema, updatePurchaseRequestSchema, purchaseRequestFilterSchema, purchaseRequestIdSchema, } from '../validators/purchase-request.validator.js';
import { logRequest } from '../utils/logger.js';
export const createPurchaseRequest = async (req, res, next) => {
    const startTime = Date.now();
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new Error('Authentication required.');
        }
        const data = createPurchaseRequestSchema.parse(req.body);
        const purchaseRequest = await purchaseRequestService.createPurchaseRequest(userId, data);
        logRequest('POST', '/purchase-requests', true, `Created Purchase Request id=${purchaseRequest.id}`, startTime);
        res.status(201).json({
            data: purchaseRequest,
        });
    }
    catch (error) {
        logRequest('POST', '/purchase-requests', false, 'Failed to create Purchase Request', startTime);
        next(error);
    }
};
export const getPurchaseRequests = async (req, res, next) => {
    const startTime = Date.now();
    try {
        const filter = purchaseRequestFilterSchema.parse(req.query);
        const result = await purchaseRequestService.getPurchaseRequests(filter);
        logRequest('GET', '/purchase-requests', true, `Retrieved Purchase Requests records=${result.data.length}`, startTime);
        res.status(200).json(result);
    }
    catch (error) {
        logRequest('GET', '/purchase-requests', false, 'Failed to retrieve Purchase Requests', startTime);
        next(error);
    }
};
export const getPurchaseRequestById = async (req, res, next) => {
    const startTime = Date.now();
    try {
        const id = purchaseRequestIdSchema.parse(req.params.id);
        const purchaseRequest = await purchaseRequestService.getPurchaseRequestById(id);
        logRequest('GET', '/purchase-requests/:id', true, `Retrieved Purchase Request id=${id}`, startTime);
        res.status(200).json({
            data: purchaseRequest,
        });
    }
    catch (error) {
        logRequest('GET', '/purchase-requests/:id', false, 'Failed to retrieve Purchase Request', startTime);
        next(error);
    }
};
export const updatePurchaseRequest = async (req, res, next) => {
    const startTime = Date.now();
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new Error('Authentication required.');
        }
        const id = purchaseRequestIdSchema.parse(req.params.id);
        const data = updatePurchaseRequestSchema.parse(req.body);
        const purchaseRequest = await purchaseRequestService.updatePurchaseRequest(id, userId, data);
        logRequest('PUT', '/purchase-requests/:id', true, `Updated Purchase Request id=${id}`, startTime);
        res.status(200).json({
            data: purchaseRequest,
        });
    }
    catch (error) {
        logRequest('PUT', '/purchase-requests/:id', false, 'Failed to update Purchase Request', startTime);
        next(error);
    }
};
export const submitPurchaseRequest = async (req, res, next) => {
    const startTime = Date.now();
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new Error('Authentication required.');
        }
        const id = purchaseRequestIdSchema.parse(req.params.id);
        const purchaseRequest = await purchaseRequestService.submitPurchaseRequest(id, userId);
        logRequest('POST', '/purchase-requests/:id/submit', true, `Submitted Purchase Request id=${id}`, startTime);
        res.status(200).json({
            data: purchaseRequest,
        });
    }
    catch (error) {
        logRequest('POST', '/purchase-requests/:id/submit', false, 'Failed to submit Purchase Request', startTime);
        next(error);
    }
};
export const approvePurchaseRequest = async (req, res, next) => {
    const startTime = Date.now();
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new Error('Authentication required.');
        }
        const id = purchaseRequestIdSchema.parse(req.params.id);
        const purchaseRequest = await purchaseRequestService.approvePurchaseRequest(id, userId);
        logRequest('POST', '/purchase-requests/:id/approve', true, `Approved Purchase Request id=${id}`, startTime);
        res.status(200).json({
            data: purchaseRequest,
        });
    }
    catch (error) {
        logRequest('POST', '/purchase-requests/:id/approve', false, 'Failed to approve Purchase Request', startTime);
        next(error);
    }
};
export const rejectPurchaseRequest = async (req, res, next) => {
    const startTime = Date.now();
    try {
        const id = purchaseRequestIdSchema.parse(req.params.id);
        const purchaseRequest = await purchaseRequestService.rejectPurchaseRequest(id);
        logRequest('POST', '/purchase-requests/:id/reject', true, `Rejected Purchase Request id=${id}`, startTime);
        res.status(200).json({
            data: purchaseRequest,
        });
    }
    catch (error) {
        logRequest('POST', '/purchase-requests/:id/reject', false, 'Failed to reject Purchase Request', startTime);
        next(error);
    }
};
