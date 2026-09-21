import * as goodsReceiptRepository from '../repositories/goods-receipt.repository.js';
import * as purchaseOrderRepository from '../repositories/purchase-order.repository.js';
import * as purchaseRequestRepository from '../repositories/purchase-request.repository.js';
import { AppError } from '../utils/app-error.js';
const generateGoodsReceiptNumber = () => {
    const timestamp = Date.now();
    return `GR-${new Date().getFullYear()}-${timestamp}`;
};
export const createGoodsReceipt = async (userId, data) => {
    const purchaseOrder = await purchaseOrderRepository.getPurchaseOrderById(data.purchase_order_id);
    if (!purchaseOrder) {
        throw new AppError(404, 'PURCHASE_ORDER_NOT_FOUND', 'Purchase Order not found.');
    }
    /*
     * Verify that the Purchase Order belongs to
     * the authenticated USER.
     */
    const purchaseRequest = await purchaseRequestRepository.getPurchaseRequestById(purchaseOrder.purchase_request_id);
    if (!purchaseRequest) {
        throw new AppError(404, 'PURCHASE_REQUEST_NOT_FOUND', 'Purchase Request not found.');
    }
    if (purchaseRequest.requested_by !== userId) {
        throw new AppError(403, 'GOODS_RECEIPT_FORBIDDEN', 'You are not allowed to create a Goods Receipt for this Purchase Order.');
    }
    /*
     * The repository performs the authoritative status
     * and quantity checks inside the transaction with locks.
     */
    const goodsReceiptNumber = generateGoodsReceiptNumber();
    return goodsReceiptRepository.createGoodsReceipt(goodsReceiptNumber, data);
};
export const getGoodsReceiptById = async (id, userId, role) => {
    const goodsReceipt = await goodsReceiptRepository.getGoodsReceiptById(id);
    if (!goodsReceipt) {
        throw new AppError(404, 'GOODS_RECEIPT_NOT_FOUND', 'Goods Receipt not found.');
    }
    /*
     * APPROVER and ADMIN can access all Goods Receipts.
     */
    if (role !== 'USER') {
        return goodsReceipt;
    }
    /*
     * USER can only access Goods Receipts generated
     * from their own Purchase Order / Purchase Request.
     */
    const purchaseOrder = await purchaseOrderRepository.getPurchaseOrderById(goodsReceipt.purchase_order_id);
    if (!purchaseOrder) {
        throw new AppError(404, 'PURCHASE_ORDER_NOT_FOUND', 'Purchase Order not found.');
    }
    const purchaseRequest = await purchaseRequestRepository.getPurchaseRequestById(purchaseOrder.purchase_request_id);
    if (!purchaseRequest ||
        purchaseRequest.requested_by !== userId) {
        throw new AppError(403, 'GOODS_RECEIPT_FORBIDDEN', 'You are not allowed to access this Goods Receipt.');
    }
    return goodsReceipt;
};
